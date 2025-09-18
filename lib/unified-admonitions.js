import { visit } from "unist-util-visit";

const admonitionTypes = ["note", "tip", "warning", "danger", "info"];

function unifiedAdmonitions() {
	return (tree) => {
		visit(tree, "containerDirective", (node) => {
			if (admonitionTypes.includes(node.name)) {
				let data = node.data;
				if (!data) {
					data = {};
					node.data = data;
				}
				data.hName = "div";
				data.hProperties = {
					className: `admonition admonition-${node.name} alert alert-${node.name === "warning" ? "warning" : node.name === "danger" ? "error" : "info"}`,
				};
			}
		});
	};
}

export default unifiedAdmonitions;
