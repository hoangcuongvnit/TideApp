import { Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, Validators, NgForm, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FuseAlertType } from '@fuse/components/alert';
import { RolesService } from 'app/modules/admin/roles/roles.service';
import { TranslocoModule } from '@jsverse/transloco';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { RoleForm } from '../role.types';
import { MatDialog } from '@angular/material/dialog';
import { ErrorDialogComponent } from 'app/layout/common/error-dialog/error-dialog.component';

@Component({
    selector: 'app-role-detail',
    templateUrl: './detail.component.html',
    styleUrls: ['./detail.component.scss'],
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
        MatDialogModule,
    ],
})
export class DetailComponent implements OnInit {
    @ViewChild('roleDetailNgForm') roleDetailNgForm: NgForm;

    alert: { type: FuseAlertType; message: string } = {
        type: 'success',
        message: '',
    };
    roleForm: FormGroup<RoleForm>;
    showAlert: boolean = false;
    isLoading: boolean = false;
    permissions: string[] = ['Permission 1', 'Permission 2', 'Permission 3'];
    navigationTo: string = '/roles/list';

    constructor(
        private fb: UntypedFormBuilder,
        private rolesService: RolesService,
        private router: Router,
        private route: ActivatedRoute,
        private dialog: MatDialog // Inject MatDialog
    ) { }

    ngOnInit(): void {
        // Initialize the form
        this.roleForm = this.fb.group({
            name: [
                '',
                [Validators.required],
            ],
            description: [''],
            permissions: this.fb.array(this.permissions.map(() => this.fb.control(false))),
        });

        // Check if we are in edit mode
        const roleId = this.route.snapshot.paramMap.get('id');
        if (roleId) {
            this.loadRole(roleId);
        }
    }

    loadRole(roleId: string): void {
        this.isLoading = true;

        this.rolesService.getRoleById(roleId).subscribe({
            next: (role) => {
                if (role) {
                    this.roleForm.patchValue({
                        name: role.name,
                        description: role.description,
                        permissions: role.permissions.filter((permission) =>
                            this.permissions.includes(permission)
                        ),
                    });
                } else {
                    this.openErrorDialog('Role not found. Please check the ID and try again.');
                }
                this.isLoading = false;
            },
            error: () => {
                this.isLoading = false;
                this.openErrorDialog('Failed to load role. Please try again.');
            },
        });
    }

    openErrorDialog(message: string): void {
        const dialogRef = this.dialog.open(ErrorDialogComponent, {
            width: '400px',
            data: {
                message: message
            },
        });

        // Trigger redirect logic after the dialog is closed
        dialogRef.afterClosed().subscribe(() => {
            this.router.navigate([this.navigationTo]);
        });
    }

    onSubmit(): void {
        // Return if the form is invalid
        if (this.roleForm.invalid) {
            return;
        }

        // Disable the form
        this.roleForm.disable();

        // Hide the alert
        this.showAlert = false;

        // Submit the form data
        this.rolesService.saveRole(this.roleForm.value).subscribe(
            () => {
                // Show success alert
                this.alert = {
                    type: 'success',
                    message: 'Role saved successfully!',
                };
                this.showAlert = true;

                // Navigate to the roles list
                this.router.navigate(['/admin/roles']);
            },
            (error) => {
                // Re-enable the form
                this.roleForm.enable();

                // Reset the form
                this.roleDetailNgForm.resetForm();

                // Show error alert
                this.alert = {
                    type: 'error',
                    message: 'Failed to save the role. Please try again.',
                };
                this.showAlert = true;
            }
        );
    }

    checkRoleName(event: FocusEvent): void {
        const roleName = this.roleForm.get('name')?.value;
        if (roleName) {
            this.rolesService.verifyRoleName(roleName).subscribe({
                next: (isTaken: boolean) => {
                    if (isTaken) {
                        this.roleForm.get('name')?.setErrors({ roleNameTaken: true });
                    } else {
                        this.roleForm.get('name')?.setErrors(null);
                    }
                },
                error: () => {
                    // Handle API error gracefully
                    this.roleForm.get('name')?.setErrors({ roleNameTaken: true });
                }
            });
        }
    }
}
