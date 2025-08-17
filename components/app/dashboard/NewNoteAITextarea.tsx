import { Textarea } from "@/components/ui/textarea";
import { FormEvent, useEffect, useState } from "react";
import ButtonLoader from "../ButtonLoader";
import { Sparkles } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { searchPrompt } from "@/lib/process-prompt";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { Skeleton } from "@/components/ui/skeleton";

export default function NewNoteAITextarea({}) {
  const [prompt, setPrompt] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [searchRecommandations, setSearchRecommandations] = useState<{
    [key: string]: string;
  }>();
  const { user } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    async function searchAIPrompt() {
      const apiKey =
        user?.gemini_api_key || process.env.NEXT_PUBLIC_FALLBACK_LLM_API_KEY;
      if (!apiKey) return null;
      const apiResponse = await axios.post(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
        {
          contents: [
            {
              parts: [
                {
                  text: searchPrompt,
                },
              ],
            },
          ],
        },
        {
          headers: {
            "X-goog-api-key": apiKey,
          },
        }
      );

      const response = apiResponse.data.candidates[0].content.parts[0]
        .text as string;
      setSearchRecommandations(
        JSON.parse(response.slice(8, response.length - 4))
      );
    }
    searchAIPrompt();
  }, [user]);

  async function handleAINoteGeneration(e: FormEvent<HTMLFormElement>) {
    try {
      e.preventDefault();
      setLoading(true);
      toast.info("Under Development, until create note manually.");
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Try again!");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="flex flex-col justify-center items-center h-full">
      <h2 className="text-3xl mb-2 font-bold text-primary">
        Hello, {user?.name.split(" ")[0]}
      </h2>
      <section className="max-w-2xl w-full p-2 border rounded-md relative">
        <form onSubmit={(e) => handleAINoteGeneration(e)}>
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            required
            disabled={loading}
            placeholder="Write your prompt..."
            className="border-none dark:bg-transparent shadow-none min-h-10 max-h-48 focus-visible:border-none focus-visible:ring-0"
          />
          <div className="flex justify-between items-end mt-4">
            <span className="text-muted-foreground">Gemini-2.0-flash</span>
            <ButtonLoader
              loading={loading}
              disabled={loading || prompt.length == 0}
              loadingLabel={"Generating..."}
              label={
                <div className="flex gap-1 items-center">
                  <Sparkles /> Generate
                </div>
              }
            />
          </div>
        </form>
      </section>
      {searchRecommandations ? (
        <div className="max-w-2xl w-full flex flex-col mt-4">
          <>
            {Array.from({ length: 3 }).map((_, i) => {
              return (
                <span
                  className="my-1 p-1 px-2 rounded-lg hover:bg-accent cursor-pointer"
                  key={i}
                  onClick={() => setPrompt(searchRecommandations[`${i}`])}
                >
                  {searchRecommandations[`${i}`]}
                </span>
              );
            })}
          </>
        </div>
      ) : (
        <div className="max-w-2xl w-full flex flex-col mt-4">
          <>
            {Array.from({ length: 3 }).map((_, i) => {
              return (
                <Skeleton
                  className="my-1 h-7 px-2 rounded-lg hover:bg-accent cursor-pointer"
                  key={i}
                />
              );
            })}
          </>
        </div>
      )}
    </section>
  );
}
