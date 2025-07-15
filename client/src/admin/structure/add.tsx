import AdminPanel from "../layout/AdminPanel";
import GridManager from "./gridManager";

const AddEdit = () => {
  return (
    <>
      <AdminPanel>
        <Content />
      </AdminPanel>
    </>
  );
};

const Content = () => {
  return (
    <>
      <GridManager />
    </>
  );
};

export default AddEdit;
