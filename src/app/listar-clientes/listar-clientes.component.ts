import {Component, OnInit, ViewChild, ElementRef} from '@angular/core';

import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatAutocompleteSelectedEvent, MatAutocompleteTrigger,
    MatChipInputEvent, MatSelectionList, ErrorStateMatcher} from '@angular/material';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { DOWN_ARROW, TAB, ESCAPE } from '@angular/cdk/keycodes';
import {FormControl, Validators, FormGroup, FormBuilder, FormGroupDirective, NgForm} from '@angular/forms';

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return isSubmitted;
  }
}

@Component({
  selector: 'app-listar-clientes',
  templateUrl: './listar-clientes.component.html',
  styleUrls: ['./listar-clientes.component.scss']
})

export class ListarClientesComponent implements OnInit {
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = false;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  fruitCtrl = new FormControl();
  filteredFruits: Observable<string[]>;
  fruits: string[] = ['Strawberry'];
  allFruits: string[] = ['Apple', 'Lemon', 'Lime', 'Orange', 'Strawberry'];

  @ViewChild('fruitInput') fruitInput: ElementRef<HTMLInputElement>;
  @ViewChild('fruitInput', {read: MatAutocompleteTrigger}) autoComplete;
  @ViewChild('fruitSelectionList') fruitSelectionList: MatSelectionList;

  constructor(private fb: FormBuilder) { }

  error: any = {};
  regiForm: FormGroup;
  matcher = new MyErrorStateMatcher();

  ngOnInit() {

    this.regiForm = this.fb.group({
      'email' : ['', Validators.compose([Validators.email, Validators.required])],
      'LastName' : [null, Validators.required],
      'estado' : [null, Validators.required],
    });

    this.error.email = 'E-mail obrigatorio';

    this.filteredFruits = this.fruitCtrl.valueChanges.pipe(
        startWith(null),
        map((fruit: string | null) => fruit ? this._filter(fruit) : this.allFruits.slice()));
  }

  onInputKeyboardNavigation(event) {
   switch (event.keyCode) {
      case DOWN_ARROW:
            this.fruitSelectionList.options.first.focus();
        break;
      default:
    }
  }

  onListKeyboardNavigation(event) {
   switch (event.keyCode) {
      case TAB:
      case ESCAPE:
            this.fruitInput.nativeElement.focus();
            this.autoComplete.closePanel();
        break;
      default:
    }
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    if ((value || '').trim()) {
      this.addFruit(value);
   }

    if (input) {
      input.value = '';
    }

    this.fruitCtrl.setValue(null);
  }

  remove(fruit: string): void {
    const index = this.fruits.indexOf(fruit);
    if (index >= 0) {
      this.fruits.splice(index, 1);
    }
  }

  onFruitSelectionChange(event: MatAutocompleteSelectedEvent): void {
    this.updateFruitList(event.option.value);
    this.fruitInput.nativeElement.value = '';
    this.fruitCtrl.setValue(null);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allFruits.filter(option => option.toLowerCase().includes(filterValue));
  }

  addFruit(fruit: string): void {
    this.fruits.push(fruit);
  }

  isFruitSelected(fruit: string): boolean {
     return this.fruits.indexOf(fruit) >= 0;
  }

  updateFruitList(fruit: string): void {
    if (this.isFruitSelected(fruit)) {
        this.remove(fruit);
    } else {
      this.addFruit(fruit);
    }
  }
}
