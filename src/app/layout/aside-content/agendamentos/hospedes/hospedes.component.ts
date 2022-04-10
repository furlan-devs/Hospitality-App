import {
  DialogConfirmacaoComponent,
  Data,
} from './../../../dialog/dialog-confirmacao/dialog-confirmacao.component';
import { AfterViewInit } from '@angular/core';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { HospedeService } from 'src/app/core/services/api/hospede.service';
import { Hospede } from 'src/app/shared/models/hospedes.model';
import { cloneDeep } from 'lodash';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-hospedes',
  templateUrl: './hospedes.component.html',
  styleUrls: ['./hospedes.component.css'],
})
export class HospedesComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    public dialog: MatDialog,
    private formBuilder: FormBuilder,
    private hospedeService: HospedeService,
    private toastr: ToastrService
  ) {}

  hospedeForm: FormGroup;
  hospede: Hospede;
  hospedes: Hospede[] = [];

  edit = false;

  mockHospede: Hospede[] = [
    {
      id: 1,
      nome: 'Matheus Furlan',
      email: 'matheus@yahoo.com.br',
      rg: '365356521',
      cpf: '56286356265',
      dataNasc: '31-10-1995',
      telefone: '12-951231923',
    },
    {
      id: 1,
      nome: 'Brenda Borba',
      email: 'Brendinha@yahoo.com.br',
      rg: '357858548',
      cpf: '4251869533',
      dataNasc: '28-05-2003',
      telefone: '12-951231523',
    },
    {
      id: 1,
      nome: 'Ana Carolina',
      email: 'Aninha@yahoo.com.br',
      rg: '365859658',
      cpf: '4152563356',
      dataNasc: '31-03-2000',
      telefone: '12-951283123',
    }
  ];

  dataSource = new MatTableDataSource<Hospede>(this.mockHospede); //caso utilizar mock, alterar o this.hospedes por this.mockHospedes e inativar todos "getHospedes do componente"
  columnsToDisplay = ['nome', 'email', 'rg', 'telefone', 'editar', 'excluir'];

  ngOnInit(): void {
    // this.getHospedes();
    this.iniciaForm();
  }

  // getHospedes(): void {
  //   this.hospedes.push(new Hospede());
  //   this.dataSource.data = this.hospedes;
  //   this.hospedeService.getAll().subscribe(
  //     (hospedes) => {
  //       this.hospedes = hospedes;
  //       this.dataSource.data = this.hospedes;
  //     },
  //     (err) => {
  //       this.toastr.error(`Falha ao carregar Hospedes.`);
  //       console.log(err);
  //     }
  //   );
  // }

  applyFilter(event: Event) {
    console.log(event, 'event');
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  adicionarHospede(modalHospede): void {
    this.hospede = new Hospede();
    this.iniciaForm();
    const dialogRef = this.dialog.open(modalHospede, {
      width: '550px',
    });
  }

  onClickFechar(): void {
    this.dialog.closeAll();
  }

  onSubmit(): void {
    if (this.hospedeForm.valid) {
      if (!this.edit) {
        console.log(this.hospede);
        this.hospedeService.add(this.hospede).subscribe(
          (result) => {
            if (result.success) {
              this.dataSource.data = this.mockHospede;
              this.iniciaForm();
              this.toastr.success(`Hospede cadastrado com sucesso!`);
              // this.getHospedes();
            } else {
              if (result.data) {
                if (result.message) {
                  this.toastr.error(result.message);
                }
                result.data.forEach((element) => {
                  this.toastr.error(element.key + ' - ' + element.message);
                });
              }
            }
          },
          (err) => {
            this.toastr.error(`Falha ao adicionar Hosepde.`);
            console.log(err);
          }
        );
      }
      this.dialog.closeAll();
    }
  }

  iniciaForm() {
    //formControlName no html
    this.hospedeForm = this.formBuilder.group({
      nome: ['', Validators.required],
      email: ['', Validators.required],
      rg: ['', Validators.required],
      telefone: ['', Validators.required],
    });
  }

  buttonEdit(element, modalHospede, index): void {
    console.log('fecharaqui');

    this.hospede = cloneDeep(element);

    // tratativa para pegar a DAta de nascimento anteriomente cadastrada
    // teve que fazer isso pq ela vem como dateTime mas o input é só date.
    this.hospede.dataNasc = `${element.dataNasc.substr(0, 10)}`;

    const dialogRef = this.dialog.open(modalHospede, {
      width: '550px',
    });
    this.edit = true;
    dialogRef.afterClosed().subscribe((result) => {
      if (
        (this.hospede.nome != element.nome ||
          this.hospede.email != element.email ||
          this.hospede.rg != element.rg ||
          this.hospede.cpf != element.cpf ||
          this.hospede.dataNasc != element.dataNasc.substr(0, 10) ||
          this.hospede.telefone != element.telefone) &&
        result != false
      ) {
        //quando cancela me retorna falso.
        this.edit = false;

        this.hospedeService.update(this.hospede).subscribe(
          () => {
            // this.getHospedes();
            this.hospedeForm.clearValidators();
            this.toastr.success(`Hospede editado com sucesso.`);
          },
          (err) => {
            this.toastr.error(`Falha ao editar Hospede.`);
            console.log(err);
          }
        );
      } else if (
        (this.hospede.nome == element.nome ||
          this.hospede.email == element.email ||
          this.hospede.rg == element.rg ||
          this.hospede.cpf == element.cpf ||
          this.hospede.dataNasc == element.dataNasc.substr(0, 10) ||
          this.hospede.telefone == element.telefone) &&
        result != false
      ) {
        this.toastr.info(`Nada alterado.`);
      }
      this.edit = false;
    });
  }

  buttonRemove(element): void {
    const dialogRef = this.dialog.open(DialogConfirmacaoComponent, {
      width: '650px',
      data: {
        titulo: 'Essa ação não poderá ser desfeita.',
        texto: 'Deseja Continuar?',
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log('entrou no remove');
        this.hospedeService.delete(element.id).subscribe(
          () => {
            // this.getHospedes();
            this.toastr.success(`Hospede excluído com sucesso!`);
          },
          (err) => {
            this.toastr.error(`Falha ao excluir Hospede`);
            console.log(err);
          }
        );
      }
    });
  }
}
