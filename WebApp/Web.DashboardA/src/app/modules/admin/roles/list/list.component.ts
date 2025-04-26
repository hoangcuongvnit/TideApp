import { Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, NgForm, UntypedFormControl } from '@angular/forms';
import { Router } from '@angular/router';
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
import { MatProgressBarModule } from '@angular/material/progress-bar';

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
    ],
})
export class ListComponent implements OnInit {
    @ViewChild('roleFormNgForm') roleFormNgForm: NgForm;

    alert: { type: FuseAlertType; message: string } = {
        type: 'success',
        message: '',
    };
    roleForm: UntypedFormGroup;
    showAlert: boolean = false;
    isLoading: boolean = false;
    searchInputControl: UntypedFormControl = new UntypedFormControl();

    constructor(
        private fb: UntypedFormBuilder,
        private rolesService: RolesService,
        private router: Router
    ) {}

    ngOnInit(): void {
        // Initialize
    }
}