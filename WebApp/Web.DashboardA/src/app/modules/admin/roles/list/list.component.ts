import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { RolesService } from 'app/modules/admin/roles/roles.service';
import { TranslocoModule } from '@jsverse/transloco';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { FuseCardComponent } from '@fuse/components/card';
import { Role, RoleListItem, RoleListResponse } from '../role.types';
import { Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'app-roles',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.scss'],
    imports: [
        TranslocoModule,
        CommonModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatCheckboxModule,
        MatButtonModule,
        MatIconModule,
        MatProgressBarModule,
        MatTableModule,
        RouterModule,
        FuseCardComponent,
    ],
})
export class ListComponent implements OnInit, AfterViewInit, OnDestroy {
    isLoading: boolean = false;
    searchInputControl: UntypedFormControl = new UntypedFormControl();
    roles: RoleListItem[] = [];
    displayedColumns: string[] = ['name', 'description', 'permissions', 'createdAt', 'actions'];
    dataSource = new MatTableDataSource<RoleListItem>(this.roles);
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(private rolesService: RolesService, private _changeDetectorRef: ChangeDetectorRef) { }

    ngOnInit(): void {
        // Get the brands
        this.rolesService.roleList$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((roleListResponse: RoleListResponse) => {
                // Update the roleList
                this.roles = roleListResponse.roles;
                this.dataSource.data = roleListResponse.roles;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });
    }

    ngAfterViewInit(): void {
        throw new Error('Method not implemented.');
    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    fetchRoles(): void {
        this.rolesService.getAllRoles().subscribe((roleListResponse) => {
            this.roles = roleListResponse.roles;
            this.dataSource.data = roleListResponse.roles;
        });
    }

    deleteRole(roleId: string): void {
        // Delete role logic
    }
}