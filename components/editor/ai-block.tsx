import { createReactBlockSpec } from "@blocknote/react";
import { Input } from "../ui/input";
import axios from "axios";
import ButtonLoader from "../app/ButtonLoader";

export const InputActionBlock = createReactBlockSpec(
  {
    type: "inputAction",
    content: "inline",
    propSchema: {
      value: { default: "" },
      loading: { default: false },
    },
  },
  {
    render: (props) => {
      const { value } = props.block.props;
      let { loading } = props.block.props;

      const handleClick = async () => {
        loading = true;
        props.editor.updateBlock(props.block.id, {
          props: { ...props.block.props },
        });

        try {
          const apiResponse = await axios.post(
            `${process.env.NEXT_PUBLIC_API}/api/llm`,
            {
              user_instruction: value,
            }
          );

          const blocksFromLLM = JSON.parse(apiResponse.data.result);

          if (Array.isArray(blocksFromLLM)) {
            // Replace current block with returned blocks
            props.editor.replaceBlocks([props.block.id], blocksFromLLM);
          } else {
            console.error("LLM did not return an array of blocks");
          }

          loading = false;
        } catch (err) {
          console.error("Error fetching LLM result:", err);
        }
      };

      return (
        <div className="container shadow-xl dark:shadow-neutral-50/5 w-10/12 p-2 rounded-sm">
          <form
            className="md:flex md:gap-1"
            onSubmit={(e) => {
              e.preventDefault();
              handleClick();
            }}
          >
            <Input
              type="text"
              value={value}
              onChange={(e) =>
                props.editor.updateBlock(props.block.id, {
                  props: { ...props.block.props, value: e.target.value },
                })
              }
              className="border-0 bg-transparent dark:bg-transparent focus:ring-0 focus:ring-offset-0"
              placeholder="Enter prompt..."
              required={true}
            />
            <ButtonLoader type="submit" label="Generate" loading={loading} />
          </form>
        </div>
      );
    },
  }
);
