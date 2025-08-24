import { createReactBlockSpec } from "@blocknote/react";
import { Input } from "../ui/input";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { FormEvent, useState } from "react";
import ButtonLoader from "../app/ButtonLoader";
import processPrompt, { improvePromptHelper } from "@/lib/process-prompt";

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
            setImproveLoading(true);
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
                        text: improvePromptHelper(prompt),
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

            setPrompt(response);
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
          <form
            className="w-full shadow-xl drop-shadow-2xl dark:shadow-neutral-50/5 rounded-md p-2 px-8 md:py-2"
            onSubmit={(e) => handleLLMCall(e)}
          >
            <Input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="border-0 bg-transparent dark:bg-transparent focus-visible:ring-0 my-2 md:my-0 shadow-none"
              placeholder="Enter prompt..."
              disabled={loading || improveLoading}
              required
            />
            <div className="flex justify-end gap-3">
              <ButtonLoader
                loading={improveLoading}
                label={"Improve prompt"}
                loadingLabel={"Improving..."}
                onClick={() => improvePrompt()}
                type="button"
                variant={"ghost"}
                disabled={prompt.length == 0 || improveLoading}
              />
              <ButtonLoader
                loading={loading}
                disabled={improveLoading}
                type="submit"
                label={
                  <div className="flex gap-2 items-center">
                    Generate <Sparkles />
                  </div>
                }
                loadingLabel={<Loader2 className="animate-spin" />}
              />
            </div>
          </form>
        );
      };

      return <BlockComponent />;
    },
  }
);
