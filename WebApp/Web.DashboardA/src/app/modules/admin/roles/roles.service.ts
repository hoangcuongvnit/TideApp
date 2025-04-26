import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, tap } from 'rxjs';
import { RoleListResponse } from './role.types';

@Injectable({
    providedIn: 'root',
})
export class RolesService {
    private readonly apiUrl = 'api/common/roles'; // Replace with your actual API endpoint
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
    getRoleById(id: string): Observable<any> {
        return this.http.get(`${this.apiUrl}/${id}`);
    }

    /**
     * Get all roles
     */
    getAllRoles(): Observable<RoleListResponse> {
        return this.http.get<RoleListResponse>(`${this.apiUrl}`)
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
        //return this.http.get<boolean>(`/api/roles/verify-name?name=${roleName}`);
        return of(true); // Placeholder for actual implementation
    }
}