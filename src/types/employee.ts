export interface EmployeeInterface {
  id: string;
  name: string;
  position: string;
  gender: "male" | "female";
  seat?: string;
  department: string;
}