function emailTemplate(
  userName = '',
  autoNoteName = '',
  noteTitle = '',
  visitLink = '',
) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AutoNote Created</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
        }
        .container {
            border: 1px solid black;
            width: 100%;
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        .header {
            background-color: #4CAF50;
            color: white;
            padding: 10px 20px;
            border-radius: 8px 8px 0 0;
            text-align: center;
        }
        .content {
            padding: 20px;
            color: #333;
        }
        .content h1 {
            margin-top: 0;
        }
        .footer {
            text-align: center;
            padding: 20px;
            color: #999;
            font-size: 12px;
        }
        @media only screen and (max-width: 600px) {
            .container {
                width: 100%;
                margin: 10px auto;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>AutoNote Created</h1>
        </div>
        <div class="content">
            <h2>Hi, ${userName}</h2>
            <p>A new note titled "<strong>${noteTitle}</strong>" was automatically created by  "<strong>${autoNoteName}</strong>" AutoNote.</p>
            <p><a href='${visitLink}' target='_blank'>Click here</a> visit your account to view or edit the note.</p>
            <p>Thank you for using our service!</p>
        </div>
        <div class="footer">
            <p>&copy; 2024 NoteApp. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
`;
}
module.exports = { emailTemplate };
