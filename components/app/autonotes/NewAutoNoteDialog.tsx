"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { AppDispatch, RootState } from "@/redux/store";
import { AutoNoteType, DAYS } from "@/types/AutoNote.types";
import { NoteType } from "@/types/Note.type";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ButtonLoader from "../ButtonLoader";
import { getNextWeekdayTimestamp } from "@/lib/autonote-timestamp-helper";
import { toast } from "sonner";
import { createAutoNote } from "@/redux/features/autonote.features";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { v4 } from "uuid";
import { getNextDay } from "@/lib/noteTitleFormatter";

const noteTitleFormatters = [
  { formatter: "{{time}}", description: "Current time in 24-hour format" },
  { formatter: "{{time12}}", description: "Current time in 12-hour format" },
  { formatter: "{{date}}", description: "Current date" },
  { formatter: "{{day}}", description: "Current day of the week" },
  { formatter: "{{month}}", description: "Current month" },
  { formatter: "{{year}}", description: "Current year" },
  { formatter: "{{note}}", description: "Current note title" },
];

interface NewAutoNoteDialogProps {
  loading: boolean;
}

export default function NewAutoNoteDialog({ loading }: NewAutoNoteDialogProps) {
  const { uid } = useSelector((state: RootState) => state.user);
  const { notes } = useSelector((state: RootState) => state.notes);
  const [selectNote, setSelectNote] = useState<string>("none");
  const [titleFormatHoverCard, setTitleFormatHoverCard] =
    useState<boolean>(false);
  const [hours, setHours] = useState<string>("0");
  const [minutes, setMinutes] = useState<string>("0");
  const dispatch = useDispatch<AppDispatch>();
  const [form, setForm] = useState<AutoNoteType>({
    note_id: "",
    title: "",
    time: 0,
    created_at: Date.now(),
    updated_at: Date.now(),
    auth_id: "",
    days: [],
    noteTitleFormat: "",
    status: "active",
    autonote_id: v4(),
  });

  useEffect(() => {
    setForm({
      ...form,
      auth_id: uid,
    });
  }, []);

  useEffect(() => {
    setForm({
      ...form,
      days: [[...DAYS.map((d) => d.day)][new Date().getDay()]],
    });
  }, []);

  useEffect(() => {
    setForm({ ...form, note_id: selectNote !== "none" ? selectNote : "" });
  }, [selectNote]);

  useEffect(() => {
    if (hours && minutes && form.days.length > 0)
      setForm({
        ...form,
        time: getNextWeekdayTimestamp(
          getNextDay(new Date().getDay(), form.days),
          Number(hours),
          Number(minutes)
        ),
      });
  }, [hours, minutes, form.days]);

  function handleForm(e: ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleAutoNoteForm(e: FormEvent<HTMLFormElement>) {
    try {
      e.preventDefault();
      const dispatchResponse = await dispatch(
        createAutoNote({ ...form, auth_id: uid })
      );
      if (dispatchResponse.meta.requestStatus == "fulfilled")
        toast.success("New autonote created successfully!");
      else toast.error(dispatchResponse.payload as string);
    } catch (error) {
      console.error("Error creating AutoNote:", error);
      toast.error("Failed to create AutoNote. Please try again.");
    }
  }

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Create new AutoNote</DialogTitle>
        <DialogDescription>
          Enter details of the new autonote.
        </DialogDescription>
      </DialogHeader>
      <form
        onSubmit={(e) => handleAutoNoteForm(e)}
        className="flex flex-col gap-4"
      >
        <div>
          <Label className="mb-1">AutoNote title</Label>
          <Input
            value={form.title}
            onChange={(e) => handleForm(e)}
            required
            name="title"
            type="text"
            maxLength={50}
          />
        </div>
        <div>
          <Label className="mb-1">Title Format</Label>
          <Popover
            open={titleFormatHoverCard}
            onOpenChange={setTitleFormatHoverCard}
          >
            <PopoverTrigger asChild>
              <Input
                onFocus={() => setTitleFormatHoverCard(true)}
                onBlur={() => setTitleFormatHoverCard(false)}
                value={form.noteTitleFormat}
                onChange={(e) => handleForm(e)}
                required
                name="noteTitleFormat"
                type="text"
                maxLength={50}
              />
            </PopoverTrigger>
            <PopoverContent>
              <div className="text-xs text-muted-foreground">
                Supported formats:
                {noteTitleFormatters.map((item, index) => {
                  return (
                    <p key={index}>
                      <br />• <strong>{item.formatter}</strong> -{" "}
                      {item.description}
                    </p>
                  );
                })}
                <br /> Example:
                <code>
                  Meeting - {`{{day}}`} @ {`{{time}}`}
                </code>
              </div>
            </PopoverContent>
          </Popover>
        </div>
        <div>
          <Label className="mb-1">
            On Time
            <span className="text-muted-foreground">
              (follow 24-hour format)
            </span>
          </Label>
          <div className="flex justify-center my-2 gap-2 items-center">
            <Select value={hours} onValueChange={setHours}>
              <SelectTrigger>
                <SelectValue placeholder="00" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 24 }).map((a, i) => {
                  const value: string = i < 10 ? `0${i}` : `${i}`;
                  return (
                    <SelectItem key={i} value={`${i}`}>
                      {value}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
            <span className="font-bold">:</span>
            <Select value={minutes} onValueChange={setMinutes}>
              <SelectTrigger>
                <SelectValue placeholder="00" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 60 }).map((a, i) => {
                  const value: string = i < 10 ? `0${i}` : `${i}`;
                  return (
                    <SelectItem key={i} value={`${i}`}>
                      {value}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div>
          <Label className="mb-1">
            On Days{" "}
            <span
              className="px-0 mx-0 underline text-primary/80 cursor-pointer"
              onClick={() => {
                if (form.days.length == 7) setForm({ ...form, days: [] });
                else
                  setForm({
                    ...form,
                    days: [...DAYS.map((d) => d.day)],
                  });
              }}
            >
              {form.days.length == 7 ? "unselect all" : "select all"}
            </span>
          </Label>
          <div className="flex justify-between my-2">
            {DAYS.map((item, index) => {
              return (
                <Tooltip key={index}>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      size="icon"
                      className="rounded-full cursor-pointer font-semibold"
                      variant={
                        form.days.includes(item.day) ? "default" : "outline"
                      }
                      onClick={() =>
                        setForm({
                          ...form,
                          days: form.days.includes(item.day)
                            ? form.days.filter((d) => d !== item.day)
                            : [...form.days, item.day],
                        })
                      }
                    >
                      {item.label}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>{item.day}</TooltipContent>
                </Tooltip>
              );
            })}
          </div>
        </div>
        <div>
          <Label className="mb-1">Select note</Label>
          <Select value={selectNote} onValueChange={setSelectNote}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Select</SelectItem>
              {notes.map((note: NoteType) => {
                return (
                  <SelectItem value={note.note_id} key={note.note_id}>
                    {note.title}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>
        <DialogFooter>
          <DialogClose className={cn(buttonVariants({ variant: "ghost" }))}>
            cancel
          </DialogClose>
          <ButtonLoader
            type="submit"
            disabled={loading}
            className="cursor-pointer"
            label="Create AutoNote"
            loading={loading}
          />
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
