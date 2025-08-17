import { createReactBlockSpec } from "@blocknote/react";
import { Input } from "../ui/input";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import ButtonLoader from "../app/ButtonLoader";

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
            const apiResponse = await axios.post(
              `${process.env.NEXT_PUBLIC_API}/api/llm`,
              {
                user_instruction: value,
                userAPI: user.gemini_api_key,
              }
            );

            const blocksFromLLM = JSON.parse(apiResponse.data.result);

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
