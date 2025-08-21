import { createReactBlockSpec } from "@blocknote/react";
import { Input } from "../ui/input";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import ButtonLoader from "../app/ButtonLoader";
import processPrompt from "@/lib/process-prompt";

export const InputActionBlock = createReactBlockSpec(
  {
    type: "inputAction",
    content: "inline",
    propSchema: {
      value: { default: "" },
    },
  },
  {
    render: (props) => {
      const BlockComponent = () => {
        const { value } = props.block.props;

        const { user } = useSelector((state: RootState) => state.user);
        const [loading, setLoading] = useState(false);

        if (!user) return null;

        const handleLLMCall = async () => {
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
                        text: processPrompt(value),
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

            if (Array.isArray(blocksFromLLM)) {
              props.editor.replaceBlocks([props.block.id], blocksFromLLM);
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
          <div
            className="shadow-xl drop-shadow-2xl dark:shadow-neutral-50/5 w-full p-2 px-8 md:py-2 rounded-md"
            contentEditable={"false"}
          >
            <div className="md:flex md:gap-2">
              <Input
                type="text"
                value={value}
                onChange={(e) =>
                  props.editor.updateBlock(props.block.id, {
                    props: { ...props.block.props, value: e.target.value },
                  })
                }
                className="border-0 bg-transparent dark:bg-transparent focus-visible:ring-0 my-2 md:my-0 shadow-none"
                placeholder="Enter prompt..."
                autoFocus={true}
                disabled={loading}
                required
              />
              <ButtonLoader
                isIcon={true}
                loading={loading}
                label={<Sparkles />}
                loadingLabel={<Loader2 className="animate-spin" />}
                onClick={() => handleLLMCall()}
              />
            </div>
          </div>
        );
      };

      return <BlockComponent />;
    },
  }
);
