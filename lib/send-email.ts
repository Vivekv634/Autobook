import { AutoNoteType } from "@/types/AutoNote.types";
import { NoteType } from "@/types/Note.type";
import { UserType } from "@/types/User.type";
import Mailjet from "node-mailjet";
import { getNextDay } from "./noteTitleFormatter";
import { getNextWeekdayTimestamp } from "./autonote-timestamp-helper";

function emailBodyFormatter(
  user: UserType | null,
  note: NoteType,
  autonote: AutoNoteType
): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Autobook</title>
  <style>
    body {
      margin: 0;
      padding: 10px;
      font-family: "Segoe UI", sans-serif;
      background-color: #f4f7fa;
      color: #1e293b;
    }

    .container {
      max-width: 600px;
      margin: auto;
      background-color: #ffffff;
      border-radius: 10px;
      overflow: hidden;
      box-shadow: 0 0 10px rgba(0,0,0,0.05);
    }

    .header {
      background-color: #1e293b;
      color: #ffffff;
      padding: 20px;
      text-align: center;
    }

    .logo {
      max-width: 40px;
      vertical-align: middle;
      margin-right: 10px;
    }

    .brand {
      font-size: 20px;
      font-weight: bold;
      display: inline-block;
      vertical-align: middle;
    }

    .body {
      padding: 30px 20px;
    }

    .greeting {
      font-size: 18px;
      margin-bottom: 12px;
    }

    .message {
      font-size: 16px;
      line-height: 1.6;
    }

    .summary {
      margin-top: 25px;
      background-color: #f1f5f9;
      border-left: 4px solid #3b82f6;
      padding: 15px;
      border-radius: 5px;
      font-size: 15px;
    }

    .cta {
      margin-top: 30px;
      text-align: center;
    }

    .cta a {
      background-color: #3b82f6;
      color: #ffffff;
      padding: 12px 20px;
      text-decoration: none;
      border-radius: 6px;
      font-weight: 600;
      transition: background-color 0.2s ease;
    }

    .cta a:hover {
      background-color: #2563eb;
    }

    .footer {
      text-align: center;
      font-size: 12px;
      color: #94a3b8;
      padding: 20px 10px;
    }

    @media (max-width: 600px) {
      .body, .header, .footer {
        padding: 20px 15px;
      }
      .greeting {
        font-size: 16px;
      }
      .message {
        font-size: 14px;
      }
      .summary {
        font-size: 14px;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- Banner -->
    <div class="header">
      <img class="logo" src="/icons/icon-128x128.png" alt="AutoBook Logo" />
      <span class="brand">AutoBook</span>
    </div>

    <!-- Body Content -->
    <div class="body">
      <div class="greeting">Hello ${user?.name},</div>

      <div class="message">
        Your note titled <strong>"${
          note.title
        }"</strong> has just been created right on schedule — delivered at <strong>${new Date().toLocaleString()}</strong> today.
        <br /><br />
        We've already scheduled the next one to keep your momentum going.
      </div>

      <!-- Summary Line -->
      <div class="summary">
        AutoNote <strong>"${
          autonote.title
        }"</strong> will generate your next note on
        <strong>${getNextDay(
          new Date(autonote.time).getDay(),
          autonote.days
        )}</strong>,
        <strong>${getNextWeekdayTimestamp(
          new Date(),
          getNextDay(new Date(autonote.time).getDay(), autonote.days),
          new Date(autonote.time).getHours(),
          new Date(autonote.time).getMinutes()
        )}</strong>.
      </div>

      <!-- CTA -->
      <div class="cta">
        <a href="${process.env.NEXT_PUBLIC_API}/dashboard/${
    note.note_id
  }" target="_blank">Open Your Note</a>
      </div>
    </div>

    <!-- Footer -->
    <div class="footer">
      You're receiving this update because AutoNote is enabled in your AutoBook settings.<br />
      Questions? Reach us at <a href="${
        process.env.NEXT_PUBLIC_EMAIL
      }">here.</a>
    </div>
  </div>
</body>
</html>
`;
}

interface EmailData {
  email: string;
  note: NoteType;
  autonote: AutoNoteType;
}

export function sendEmail(
  emailData: EmailData[],
  user_map: Map<string, UserType>
) {
  const mailjet = Mailjet.apiConnect(
    process.env.NEXT_PUBLIC_APIKEY_PUBLIC as string,
    process.env.NEXT_PUBLIC_APIKEY_PRIVATE as string
  );
  const bulkMessages = emailData.map(({ email, note, autonote }) => ({
    From: {
      Email: process.env.NEXT_PUBLIC_FROM_EMAIL as string,
      Name: process.env.NEXT_PUBLIC_FROM_NAME as string,
    },
    To: [
      {
        Email: email,
        Name: user_map.get(autonote.auth_id)?.name || "User",
      },
    ],
    Subject: `Your new note is generated : ${note.title}`,
    HTMLPart: emailBodyFormatter(
      user_map.get(autonote.auth_id) || null,
      note,
      autonote
    ),
  }));
  const sendEmailRequest = mailjet.post("send", { version: "v3.1" }).request({
    Messages: [...bulkMessages],
  });
  sendEmailRequest
    .then((result) => {
      console.log(result.body);
    })
    .catch((err) => {
      console.error(err.statusCode);
    });
}
