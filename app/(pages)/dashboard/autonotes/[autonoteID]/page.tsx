"use client";
import { getNextWeekdayTimestamp } from "@/lib/autonote-timestamp-helper";
import { getNextDay } from "@/lib/noteTitleFormatter";
import { RootState } from "@/redux/store";
import { AutoNoteType, DAYS, DaysType } from "@/types/AutoNote.types";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import {
  Edit,
  Ellipsis,
  Info,
  SquareArrowOutUpRight,
  Trash,
} from "lucide-react";
import {
  Table,
  TableCaption,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import AutonoteEditDialog from "@/components/app/autonotes/AutonoteEditDialog";

export default function AutoNoteComponent({}) {
  const pathName = usePathname();
  const { autonotes } = useSelector((state: RootState) => state.autonote);
  const { notes } = useSelector((state: RootState) => state.notes);
  const [autonote, setAutonote] = useState<AutoNoteType | null>(null);
  const [openEditDialog, setOpenEditDialog] = useState<string | null>(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (autonotes.length > 0) {
      setAutonote(
        autonotes.find((note: AutoNoteType) =>
          pathName.includes(note.autonote_id)
        ) || null
      );
    }
  }, [autonotes, pathName]);

  if (!autonote) return null;

  const futureCreationsMap = new Map<number, { time: number; day: DaysType }>();

  const autonoteTime = new Date(autonote.time);
  let baseDate = new Date();

  for (let i = 0; i < 7; i++) {
    const currentDayIndex = baseDate.getDay();
    const nextDayName = getNextDay(currentDayIndex, autonote.days);
    const nextTimeStamp = getNextWeekdayTimestamp(
      baseDate,
      nextDayName,
      autonoteTime.getHours(),
      autonoteTime.getMinutes()
    );
    futureCreationsMap.set(i, {
      day: nextDayName,
      time: nextTimeStamp,
    });
    baseDate = new Date(nextTimeStamp);
  }

  return (
    <section className="m-2 h-full pt-2 max-w-9/12 w-full mx-auto">
      <div className="flex justify-between">
        <div className="md:flex md:gap-2 gap-1 items-center">
          <h2 className="text-3xl font-bold">{autonote.title}</h2>
          <Badge className="text-accent">
            {autonote.status[0].toUpperCase() +
              autonote.status.slice(1).toLowerCase()}
          </Badge>
          <Popover>
            <PopoverTrigger>
              <Button size={"icon"} variant={"ghost"}>
                <Info />
              </Button>
            </PopoverTrigger>
            <PopoverContent side="bottom">
              Autonote <strong>{autonote.title}</strong> will create a copy of{" "}
              <span
                onClick={() => router.push(`/dashboard/${autonote.note_id}`)}
                className="font-semibold underline flex items-center cursor-pointer"
              >
                {notes.find((note) => note.note_id === autonote.note_id)?.title}{" "}
                <SquareArrowOutUpRight className="h-4" />
              </span>{" "}
              note on days <strong>{DAYS.map((d) => d.day).join(", ")}</strong>{" "}
              at <strong>{new Date(autonote.time).toLocaleTimeString()}</strong>
            </PopoverContent>
          </Popover>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={"outline"} size={"sm"}>
              <Ellipsis />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => setOpenEditDialog(autonote.autonote_id)}
            >
              <Edit /> Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-red-500"
              onClick={() => setOpenDeleteDialog(autonote.autonote_id)}
            >
              <Trash className="text-red-500" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <Separator className="mb-14 mt-4" />
      <Table className="space-y-6">
        <TableCaption>List of future note creations.</TableCaption>
        <TableHeader>
          <TableRow className="bg-muted/20 px-6 h-14">
            <TableHead>S. no.</TableHead>
            <TableHead>Event</TableHead>
            <TableHead>Time</TableHead>
            <TableHead>Day & Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 7 }).map((_, i) => {
            const nextDate = futureCreationsMap.get(i);
            if (!nextDate || !nextDate.time || !nextDate) return null;
            const time = new Date(nextDate.time);
            return (
              <TableRow key={i} className="h-14 even:bg-muted/20 px-6">
                <TableCell>{i + 1}</TableCell>
                <TableCell>Scheduled on</TableCell>
                <TableCell>{time.toLocaleTimeString()}</TableCell>
                <TableCell>{time.toDateString()}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      <AutonoteEditDialog
        autonote={autonote}
        onClose={() => setOpenEditDialog(null)}
        openAutonoteEditDialog={openEditDialog}
        setOpenAutonoteEditDialogAction={setOpenEditDialog}
      />
    </section>
  );
}
