export function colorizer(theme) {
  switch (theme) {
    case "green":
      return "text-green-600";
    case "red":
      return "text-red-600";
    case "gray":
      return "text-gray-600";
    case "violet":
      return "text-violet-600";
    case "blue":
      return "text-blue-600";
    case "yellow":
      return "text-yellow-600";
    case "orange":
      return "text-orange-600";
    case "rose":
      return "text-rose-600";
    default:
      return "text-white";
  }
}
