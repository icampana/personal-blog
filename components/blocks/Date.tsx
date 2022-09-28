import { format, parseISO } from "date-fns";

interface DateComponentProps {
    postDate: string
}

const DateComponent = ({ postDate } : DateComponentProps) => {
    return (
        <time dateTime={postDate} className="text-xs text-gray-600 mb-1">
            {format(parseISO(postDate), "LLLL d, yyyy")}
        </time>
    );
}

export default DateComponent;