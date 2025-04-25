import { Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators, NgForm, UntypedFormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { FuseAlertType } from '@fuse/components/alert';
import { RoleService } from 'app/modules/admin/roles/detail/role.service';
import { TranslocoModule } from '@jsverse/transloco';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';

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
    ],
})
export class DetailComponent implements OnInit {
    @ViewChild('roleDetailNgForm') roleDetailNgForm: NgForm;

    alert: { type: FuseAlertType; message: string } = {
        type: 'success',
        message: '',
    };
    roleForm: UntypedFormGroup;
    showAlert: boolean = false;
    isLoading: boolean = false;
    searchInputControl: UntypedFormControl = new UntypedFormControl();
    permissions: string[] = ['Read', 'Write', 'Delete', 'Update'];

    constructor(
        private fb: UntypedFormBuilder,
        private roleService: RoleService,
        private router: Router
    ) {}

    ngOnInit(): void {
        // Initialize the form
        this.roleForm = this.fb.group({
            name: ['', Validators.required],
            description: [''],
            permissions: [[]],
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
        this.roleService.saveRole(this.roleForm.value).subscribe(
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
}
