import React from "react";
import AdminLayout from "./AdminLayout";
import RequireAdmin from "./RequireAdmin";

const AdminLayoutWrapped = RequireAdmin(AdminLayout);
export default AdminLayoutWrapped;