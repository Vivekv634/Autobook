export default function noteGenerationPeriodTime(period) {
  switch (period) {
    case '1 hr':
      return 1 * 60 * 60 * 1000;
    case '6 hr':
      return 6 * 60 * 60 * 1000;
    case '12 hr':
      return 12 * 60 * 60 * 1000;
    case '1 day':
      return 24 * 60 * 60 * 1000;
    case '7 day':
      return 7 * 24 * 60 * 60 * 1000;
    case '1 month':
      return 30 * 24 * 60 * 60 * 1000;
    default:
      break;
  }
}
