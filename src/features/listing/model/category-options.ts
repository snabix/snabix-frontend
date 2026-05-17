import type { CategoryNode } from "@/src/entities/category";

export type BranchOption = {
  id: number;
  label: string;
};

export function flattenBranchOptions(root: CategoryNode): BranchOption[] {
  const options: BranchOption[] = [];

  const walk = (node: CategoryNode, prefix: string[] = []) => {
    options.push({
      id: node.id,
      label: [...prefix, node.name].join(" / "),
    });

    node.children.forEach((child) => walk(child, [...prefix, node.name]));
  };

  walk(root);

  return options;
}
