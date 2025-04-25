import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class RoleService {
    private readonly apiUrl = '/api/roles'; // Replace with your actual API endpoint

    constructor(private http: HttpClient) {}

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
    getAllRoles(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}`);
    }

    /**
     * Delete a role by ID
     * @param id The ID of the role to delete
     */
    deleteRole(id: string): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${id}`);
    }
}