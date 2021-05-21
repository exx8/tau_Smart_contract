import moment from "moment";
export function futureDate(daysIntheFuture: number):Date {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + daysIntheFuture);
    return futureDate;

}
export function getDateString(date:Date)
{
    return moment(date).format("YYYY-MM-DDThh:mm");
    }