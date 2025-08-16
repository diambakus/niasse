import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { CartService } from '../../commons/shared/cart.service';
import { CartItem } from '../../commons/shared/common-topics';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-shopping-cart',
    imports: [
        MatStepperModule,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatCardModule,
        CommonModule,
        MatSelectModule,
        MatOptionModule,
        MatIconModule,
        TranslateModule
    ],
    templateUrl: './shopping-cart.component.html',
    styleUrl: './shopping-cart.component.scss'
})
export class ShoppingCartComponent implements OnInit, OnDestroy {
  cartItems: CartItem[] = [];
  cartItemName: string = '';

  allSteps: StepDefinition[] = [
    {
      stepId: 'personal',
      label: 'Personal Identification',
      controls: [
        { type: 'text', name: 'firstName', label: 'First Name', placeholder: 'Enter your first name', colspan: 6, validators: [Validators.required] },
        { type: 'text', name: 'lastName', label: 'Last Name', placeholder: 'Enter your last name', colspan: 6, validators: [Validators.required] },
        {
          type: 'select', name: 'gender', label: 'Gênero', colspan: 3, placeholder: 'Select your gender', validators: [Validators.required],
          options: [
            { value: 'M', label: 'Masculino' },
            { value: 'F', label: 'Feminino' },
            { value: 'O', label: 'Outro' }
          ]
        },
        { type: 'text', name: 'local', label: 'Local', placeholder: 'Enter your local', colspan: 3, validators: [Validators.required] },
      ]
    },
    {
      stepId: 'parental',
      label: 'Parental Identification',
      controls: [
        { type: 'text', name: 'motherName', label: "Mother’s Name", validators: [Validators.required] },
        { type: 'text', name: 'fatherName', label: "Father’s Name" }
      ]
    },
    {
      stepId: 'social',
      label: 'Social Data',
      controls: [
        { type: 'email', name: 'email', label: 'Email', validators: [Validators.required, Validators.email] }
      ]
    },
    {
      stepId: 'civil',
      label: 'Civil and Legal',
      controls: [
        { type: 'text', name: 'document', label: 'Document ID', validators: [Validators.required] }
      ]
    },
    {
      stepId: 'uploads',
      label: 'Uploads',
      controls: [
        { type: 'file', name: 'uploadToken', label: 'Upload Token', validators: [Validators.required] },
      ]
    }
  ];

  visibleSteps: StepDefinition[] = [];
  stepForms: FormGroup[] = [];

  fileNames: { [key: number]: { [key: string]: string } } = {};

  private destroyed$ = new Subject<void>();

  constructor(
    private cartService: CartService,
    private fb: FormBuilder,
    private router: Router,
    public translate: TranslateService
  ) { }


  ngOnInit(): void {
    this.cartService.shoppingCart$
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: (items) => {
          if (!items || items.length === 0) {
            if (this.router.url.includes('shoppingcart')) {
              this.router.navigate(['/dashboard']);
            }
            return;
          }

          this.cartItems = items;
          this.cartItemName = this.cartItems[0]?.name || 'No service selected';
          this.updateSteps();

          this.visibleSteps.forEach((step, index) => {
            step.controls?.forEach(control => {
              if (control.type === 'file') {
                if (!this.fileNames[index]) {
                  this.fileNames[index] = {};
                }
                this.fileNames[index][control.name] = '';
              }
            });
          });
        },
        error: (error) => {
          console.error(`Could not get shopping cart data: ${error}`);
        }
      });
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  updateSteps(): void {
    const selectedCartItem = this.cartItems[0];
    const selectedStepIds = selectedCartItem?.steps || [];

    const filteredSteps = this.allSteps.filter(step =>
      selectedStepIds.includes(step.stepId)
    );

    this.visibleSteps = [
      ...filteredSteps,
      { stepId: 'done', label: 'Done', isDoneStep: true }
    ];

    this.stepForms = filteredSteps.map(step => {
      const group: Record<string, any> = {};
      step.controls?.forEach(control => {
        group[control.name] = ['', control.validators || []];
      });
      return this.fb.group(group);
    });
  }

  getForm(index: number): FormGroup {
    return this.stepForms[index] ?? new FormGroup({});
  }

  getStepControl(step: StepDefinition, index: number): FormGroup {
    return !step.isDoneStep ? this.getForm(index) : new FormGroup({});
  }

  submit(): void {
    if (this.stepForms.every(form => form.valid)) {
      console.log('Submitted forms:', this.stepForms.map(f => f.value));
    } else {
      console.warn('There are invalid forms.');
    }
  }

  resetStepper(stepper: MatStepper): void {
    stepper.reset();
    this.stepForms.forEach(form => form.reset());
  }

  goToNextStep(index: number, stepper: MatStepper): void {
    const form = this.getForm(index);

    if (!form.valid) {
      Object.values(form.controls).forEach(control => control.markAsTouched());
      return;
    }

    stepper.next();
  }

  onFileChange(event: Event, formIndex: number, controlName: string): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const fileName = file.name;

      const form = this.getForm(formIndex);
      form.patchValue({ [controlName]: file });
      form.get(controlName)?.markAsTouched();

      this.fileNames[formIndex][controlName] = fileName;
    } else {
      const form = this.getForm(formIndex);
      form.patchValue({ [controlName]: null });
      form.get(controlName)?.markAsUntouched();

      this.fileNames[formIndex][controlName] = '';
    }
  }

  removeFile(formIndex: number, controlName: string): void {
    const form = this.getForm(formIndex);
    form.patchValue({ [controlName]: null });
    form.get(controlName)?.markAsUntouched();

    this.fileNames[formIndex][controlName] = '';
  }
}

interface StepDefinition {
  stepId: string;
  label: string;
  controls?: StepControl[];
  isDoneStep?: boolean;
}

interface StepControl {
  type: 'text' | 'email' | 'file' | 'select';
  name: string;
  label: string;
  placeholder?: string;
  validators?: any[];
  colspan?: number;
  options?: { value: string; label: string }[];
}