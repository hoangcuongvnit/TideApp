import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, tap } from 'rxjs';
import { Role, RoleListResponse } from './role.types';

@Injectable({
    providedIn: 'root',
})
export class RolesService {
    private readonly apiUrl = 'api/common'; // Replace with your actual API endpoint
    private _rolelist: BehaviorSubject<RoleListResponse | null> =
        new BehaviorSubject(null);

    constructor(private http: HttpClient) { }

    /**
     * Getter for brands
     */
    get roleList$(): Observable<RoleListResponse> {
        return this._rolelist.asObservable();
    }

    /**
     * Save a role
     * @param role The role data to save
     */
    saveRole(role: any): Observable<any> {
        return this.http.post(`${this.apiUrl}`, role);
    }

    /**
     * Get a role by ID
     * @param id The ID of the role
     */
    getRoleById(id: string): Observable<Role> {
        return this.http.get<Role>(`${this.apiUrl}/role/${id}`);
    }

    /**
     * Get all roles
     */
    getAllRoles(): Observable<RoleListResponse> {
        return this.http.get<RoleListResponse>(`${this.apiUrl}/roles`)
            .pipe(
                tap((roleList) => {
                    this._rolelist.next(roleList);
                })
            );
    }

    /**
     * Delete a role by ID
     * @param id The ID of the role to delete
     */
    deleteRole(id: string): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${id}`);
    }

    /**
     * verify Role Name
     * @param roleName 
     * @returns 
     */
    verifyRoleName(roleName: string): Observable<boolean> {
        return this.http.get<boolean>(`${this.apiUrl}/verify-role-name/${roleName}`);
    }
}