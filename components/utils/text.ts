/**
 * Removes accents, and transforms a tag into a valid slug.
 * @param tag string
 * @returns
 */
export const cleanTag = (tag: string) => {
	return tag
		.toLowerCase()
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "")
		.replace(" ", "-");
};
