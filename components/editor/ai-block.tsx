import { createReactBlockSpec } from "@blocknote/react";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { FormEvent, useState } from "react";
import ButtonLoader from "../app/ButtonLoader";
import processPrompt, { improvePromptHelper } from "@/lib/process-prompt";
import { Card } from "../ui/card";
import { Textarea } from "../ui/textarea";

export const InputActionBlock = createReactBlockSpec(
  {
    type: "inputAction",
    content: "none",
    propSchema: {},
  },
  {
    render: (props) => {
      const BlockComponent = () => {
        const { user } = useSelector((state: RootState) => state.user);
        const [prompt, setPrompt] = useState<string>("");
        const [loading, setLoading] = useState(false);
        const [improveLoading, setImproveLoading] = useState(false);

        if (!user) return null;

        const improvePrompt = async () => {
          try {
            if (prompt.trim().length === 0) return;

            setImproveLoading(true);
            toast.info("Improving prompt...");

            const apiKey =
              user.gemini_api_key ||
              process.env.NEXT_PUBLIC_FALLBACK_LLM_API_KEY;
            if (!apiKey) {
              toast.error("Getting error while generating content!");
              console.error("API key not given.");
              return;
            }

            const apiResponse = await axios.post(
              "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
              {
                contents: [{ parts: [{ text: improvePromptHelper(prompt) }] }],
              },
              {
                headers: {
                  "X-goog-api-key": apiKey,
                  "Content-Type": "application/json",
                },
              }
            );

            // Defensive parsing
            const candidate = apiResponse?.data?.candidates?.[0];
            const part = candidate?.content?.parts?.[0];
            const response =
              typeof part?.text === "string" ? part.text.trim() : "";

            if (response) {
              setPrompt(response);
              toast.success("Prompt improved!");
            } else {
              // Do NOT clobber the user’s prompt
              toast.warning(
                "LLM returned an empty improvement. Keeping your original prompt."
              );
              console.warn(
                "ImprovePrompt: empty/undefined response payload:",
                apiResponse?.data
              );
            }
          } catch (err) {
            toast.error("Getting error while generating content!");
            console.error("Error fetching LLM result:", err);
          } finally {
            setImproveLoading(false);
          }
        };

        const handleLLMCall = async (e: FormEvent<HTMLFormElement>) => {
          e.preventDefault();
          setLoading(true);
          props.editor.updateBlock(props.block.id, {
            props: { ...props.block.props },
          });

          toast.info("Generating content...");
          try {
            const apiKey =
              user.gemini_api_key ||
              process.env.NEXT_PUBLIC_FALLBACK_LLM_API_KEY;
            if (!apiKey) {
              toast.error("Getting error while generating content!");
              console.error("API key not given.");
              return;
            }
            const apiResponse = await axios.post(
              "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
              {
                contents: [
                  {
                    parts: [
                      {
                        text: processPrompt(prompt, user.responseType),
                      },
                    ],
                  },
                ],
              },
              {
                headers: {
                  "X-goog-api-key": apiKey,
                  "Content-Type": "application/json",
                },
              }
            );
            const response = apiResponse.data.candidates[0].content.parts[0]
              .text as string;
            const processedResponse = response.slice(8, response.length - 4);

            const blocksFromLLM = JSON.parse(processedResponse);
            props.editor.replaceBlocks([props.block.id], blocksFromLLM);
            if (Array.isArray(blocksFromLLM)) {
              toast.success("Content generated!");
            } else {
              console.error("LLM did not return an array of blocks");
              toast.error("Getting error while generating content!");
            }
          } catch (err) {
            toast.error("Getting error while generating content!");
            console.error("Error fetching LLM result:", err);
          } finally {
            setLoading(false);
          }
        };

        return (
          <Card className="w-full shadow-xl focus-visible:ring-0 dark:shadow-neutral-50/5 rounded-md p-2 md:px-8 md:py-2 ring-0">
            <form onSubmit={(e) => handleLLMCall(e)}>
              <Textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                required
                disabled={loading || improveLoading}
                placeholder="Write your prompt..."
                className="border-none dark:bg-transparent shadow-none h-14 focus-visible:border-none focus-visible:ring-0"
              />
              <div className="flex justify-end gap-3">
                <ButtonLoader
                  type="button" // <-- add this
                  loading={improveLoading}
                  label={"Improve prompt"}
                  loadingLabel={"Improving..."}
                  onClick={improvePrompt}
                  variant={"ghost"}
                  disabled={prompt.length == 0 || improveLoading || loading}
                />
                <ButtonLoader
                  loading={loading}
                  disabled={improveLoading || prompt.length == 0 || loading}
                  type="submit"
                  // onClick={handleLLMCall}
                  label={
                    <div className="flex gap-2 items-center">
                      Generate <Sparkles />
                    </div>
                  }
                  loadingLabel={<Loader2 className="animate-spin" />}
                />
              </div>
            </form>
          </Card>
        );
      };

      return <BlockComponent />;
    },
  }
);
