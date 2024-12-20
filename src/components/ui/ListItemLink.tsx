import ListItem from "./ListItem";
import ExternalLink from "./ExternalLink";

interface ListItemLinkProps {
  title: string;
  href?: string;
}

const ListItemLink: React.FC<ListItemLinkProps> = ({ title, href }) => (
  <ListItem title={title}>
    {href && <ExternalLink href={href} title={title} />}
  </ListItem>
);

export default ListItemLink;
