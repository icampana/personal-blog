import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";

interface DateComponentProps {
	postDate: string;
}

const DateComponent = ({ postDate }: DateComponentProps) => {
	return (
		<time dateTime={postDate} className="capitalize text-xs text-accent mb-1">
			{format(parseISO(postDate), "MMMM d, yyyy", { locale: es })}
		</time>
	);
};

export default DateComponent;
