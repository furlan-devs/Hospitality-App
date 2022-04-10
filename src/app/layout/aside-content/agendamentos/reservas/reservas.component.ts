import { DialogConfirmacaoComponent, Data } from './../../../dialog/dialog-confirmacao/dialog-confirmacao.component';
import { AfterViewInit } from '@angular/core';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ReservaService } from 'src/app/core/services/api/reserva.service';
import { Reserva } from 'src/app/shared/models/reservas.model';
import { cloneDeep } from 'lodash';
import { ToastrService } from 'ngx-toastr';
import { HospedeService } from 'src/app/core/services/api/hospede.service';
import { QuartoService } from 'src/app/core/services/api/quarto.service';
import { FuncionarioService } from 'src/app/core/services/api/funcionario.service';
import { Hospede } from 'src/app/shared/models/hospedes.model';
import { Quarto } from 'src/app/shared/models/quartos.model';
import { Funcionario } from 'src/app/shared/models/funcionarios.model';
import { StatusReserva } from 'src/app/shared/models/statusReserva.model';



@Component({
  selector: 'app-reservas',
  templateUrl: './reservas.component.html',
  styleUrls: ['./reservas.component.css']
})
export class ReservasComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    public dialog: MatDialog,
    private formBuilder: FormBuilder,
    private reservaService: ReservaService,
    private toastr: ToastrService,
    private hospedeService: HospedeService,
    private funcionarioService: FuncionarioService,
    private quartoService: QuartoService,
  ) { }

  reservaForm: FormGroup;

  reserva: Reserva;
  reservas: Reserva[] = [];

  hospedes: Hospede[] = [];
  funcionarios: Funcionario[] = [];
  quartos: Quarto[] = [];
  status: StatusReserva[] = [
    {
      id:1,
      nome: "Pré-Reserva"
    },
    {
      id:2,
      nome: "Confirmada"
    },
    {
      id:3,
      nome: "Check-In"
    },
    {
      id:4,
      nome: "Check-Out"
    },
    {
      id:5,
      nome: "Cancelada"
    }
  ];

  edit = false;


  dataSource = new MatTableDataSource<Reserva>(this.reservas); //caso utilizar mock, alterar o this.reservas pelo mock
  columnsToDisplay = [
    'id',
    'hospedeId',
    'funcionarioId',
    'quartoId',
    'dataReserva',
    'dataChegada',
    'status',
    'editar',
    'excluir'
  ];

  ngOnInit(): void {
    this.iniciaForm();
    this.getReservas();
    this.getHospedes();
    this.getFuncionarios();
    this.getQuartos();
  }

  getReservas(): void {
    this.reservas.push(new Reserva());
    this.dataSource.data = this.reservas;
    this.reservaService.getAll().subscribe(
      (reservas) => {
        this.reservas = reservas;
        this.dataSource.data = this.reservas;
      },
      (err) => {
        this.toastr.error(`Falha ao carregar Reservas.`);
        console.log(err);
      }
    );
  }

  getHospedes(): void {
    this.hospedeService.getAll().subscribe(hospedes => {
      this.hospedes = hospedes;
    }, (err) => {
      this.toastr.error('Falha ao carregar hospedes');
      console.log(err);
      }
    );
  }

  getFuncionarios(): void {
    this.funcionarioService.getAll().subscribe(funcionarios => {
      this.funcionarios = funcionarios;
    }, (err) => {
      this.toastr.error('Falha ao carregar funcionários');
      console.log(err);
      }
    );
  }

  getQuartos(): void {
    this.quartoService.getAll().subscribe(quartos => {
      this.quartos = quartos;
    }, (err) => {
      this.toastr.error('Falha ao carregar quartos');
      console.log(err);
      }
    );
  }

  applyFilter(event: Event) {
    console.log(event, "event");
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  adicionarReserva(modalReserva): void {
    this.reserva = new Reserva();
    this.iniciaForm();
    const dialogRef = this.dialog.open(modalReserva, {
      width: '550px'
    });
  }

   onClickFechar(): void {
     this.dialog.closeAll();

   }

  onSubmit(): void {

    if (this.reservaForm.valid) {
      if (!this.edit) {
        console.log(this.reserva);
        this.reservaService.add(this.reserva).subscribe((result) => {
          if (result.success) {
            this.dataSource.data = this.reservas;
            this.iniciaForm();

            console.log(this.reservas)
            this.toastr.success(`Reserva cadastrada com sucesso!`);
            this.getReservas();
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
            this.toastr.error(`Falha ao adicionar Reserva.`);
            console.log(err);
          }
        );
      }
      this.dialog.closeAll();
    }

  }

  iniciaForm() {   //formControlName no html
    this.reservaForm = this.formBuilder.group({
      hospedeId: ['', Validators.required],
      funcionarioId: ['', Validators.required],
      quartoId: ['', Validators.required],
      dataReserva: ['', Validators.required],
      dataChegada: ['', Validators.required],
      dataSaidaPrevista: ['', Validators.required],
      numeroPessoas: ['', Validators.required],
      status: ['', Validators.required],
    })
  }


  buttonEdit(element, modalReserva, index): void {
    console.log("ent");
    this.reserva = cloneDeep(element);

    // tratativa para pegar a DAta de nascimento anteriomente cadastrada
    // teve que fazer isso pq ela vem como dateTime mas o input é só date.
     this.reserva.dataReserva = `${element.dataReserva.substr(0, 10)}`;
     this.reserva.dataChegada = `${element.dataChegada.substr(0, 10)}`;
     this.reserva.dataSaidaPrevista = `${element.dataSaidaPrevista.substr(0, 10)}`;
      console.log(this.reserva.numeroPessoas, "pessoas")
    const dialogRef = this.dialog.open(modalReserva, {
      width: '550px'
    });
    this.edit = true;
    dialogRef.afterClosed().subscribe((result) => {

      if ((this.reserva.hospedeId != element.hospedeId
        || this.reserva.funcionarioId != element.funcionarioId
        || this.reserva.quartoId != element.quartoId
        || this.reserva.dataReserva != element.dataReserva.substr(0, 10)
        || this.reserva.dataChegada != element.dataChegada.substr(0, 10)
        || this.reserva.dataSaidaPrevista != element.dataSaidaPrevista.substr(0, 10)
        || this.reserva.numeroPessoas != element.numeroPessoas
        || this.reserva.status != element.status
      ) && result != false ) {  //quando cancela me retorna falso.
        this.edit = false;

        this.reservaService.update(this.reserva).subscribe(() => {
            this.getReservas();
            this.reservaForm.clearValidators();
            this.toastr.success(`Reserva editado com sucesso.`);
          },
          (err) => {
            this.toastr.error(`Falha ao editar Reserva.`);
            console.log(err);
          });
      }

      else if ((this.reserva.hospedeId != element.hospedeId
        || this.reserva.funcionarioId != element.funcionarioId
        || this.reserva.quartoId != element.quartoId
        || this.reserva.dataReserva != element.dataReserva.substr(0, 10)
        || this.reserva.dataChegada != element.dataChegada.substr(0, 10)
        || this.reserva.dataSaidaPrevista != element.dataSaidaPrevista.substr(0, 10)
        || this.reserva.numeroPessoas != element.numeroPessoas
        || this.reserva.status != element.status
      ) && result != false ) {
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
        texto:
          'Deseja Continuar?'
      }
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log("entrou no remove");
        this.reservaService.delete(element.id).subscribe(
          () => {
            this.getReservas();
            this.toastr.success(`Reserva excluído com sucesso!`);
          },
          (err) => {
            this.toastr.error(`Falha ao excluir Reserva`);
            console.log(err);
          }
        );
      }
    });
  }
  statusName(status) {
    if (status == 1) {
      return (status = "Pré-Reserva");
    } else if (status == 2) {
      return (status = "Confirmada");
    } else if (status == 3) {
      return (status = "Checked-in");
    } else if (status == 4) {
      return (status = "Checked-out");
    } else if (status == 5) {
      return (status = "Cancelada");
    }
  }

  getNomeHospede(id) {
    const hospede = this.hospedes.filter(e => e.id === id);
    return hospede.length === 0 ? 'N/A' : hospede[0].nome;
  }

  getNomeFuncionario(id) {
    const funcionario = this.funcionarios.filter(e => e.id === id);
    return funcionario.length === 0 ? 'N/A' : funcionario[0].nome;
  }
  getNumeroQuarto(id) {
    const quarto = this.quartos.filter(e => e.id === id);
    return quarto.length === 0 ? 'N/A' : quarto[0].numeroQuarto;
  }

}
