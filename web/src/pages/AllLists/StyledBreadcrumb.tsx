import styled from "styled-components";
import { Breadcrumb as BreadcrumbBase } from "@kleros/ui-components-library";

const StyledBreadcrumb = styled(BreadcrumbBase)`
  margin-bottom: 32px;
  align-items: center;
`;

interface IBreadcrumb {
  items: { text: string | Element; value: string }[];
}
const Breadcrumb: React.FC<IBreadcrumb> = ({ items }) => <StyledBreadcrumb {...{ items }} />;

export default Breadcrumb;
