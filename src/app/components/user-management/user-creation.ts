export interface UserCreationDto {
  username: string;
  email: string;
  firstname: string;
  lastname: string;
  rawPassword: string;
  role: string;
  unitsId: number[];
  displayName: string;
}