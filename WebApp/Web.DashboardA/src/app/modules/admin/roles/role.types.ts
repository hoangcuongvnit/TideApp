import { AbstractControl } from "@angular/forms";

export interface Role
{
    id: string;
    name: string;
    description: string;
    permissions: string[];
    createdAt: string;
}
export interface RoleForm
{
    name: AbstractControl<string | null>;
    description: AbstractControl<string | null>;
    permissions: AbstractControl<string[]>;
}
export interface RoleListItem extends Role {}
export interface RoleListResponse
{
    roles: RoleListItem[];
    total: number;
}