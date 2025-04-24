export interface PostItemProps {
  event: {
    id: string;
    name: string;
    description?: string;    // 改为可选
    image?: string;   // 改为可选，并允许null
    createdAt: string;
  };
}