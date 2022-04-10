import { DialogConfirmacaoComponent, Data } from './../../../dialog/dialog-confirmacao/dialog-confirmacao.component';
import { AfterViewInit } from '@angular/core';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { HospedagemService } from 'src/app/core/services/api/hospedagem.service';
import { Hospedagem } from 'src/app/shared/models/hospedagens.model';
import { cloneDeep } from 'lodash';
import { ToastrService } from 'ngx-toastr';
import { HospedeService } from 'src/app/core/services/api/hospede.service';
import { Hospede } from 'src/app/shared/models/hospedes.model';
import { Quarto } from 'src/app/shared/models/quartos.model';
import { QuartoService } from 'src/app/core/services/api/quarto.service';
import { ReservaService } from 'src/app/core/services/api/reserva.service';
import { Reserva } from 'src/app/shared/models/reservas.model';



@Component({
  selector: 'app-hospedagens',
  templateUrl: './hospedagens.component.html',
  styleUrls: ['./hospedagens.component.css']
})
export class HospedagensComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    public dialog: MatDialog,
    private formBuilder: FormBuilder,
    private hospedagemService: HospedagemService,
    private toastr: ToastrService,
    private hospedeService: HospedeService,
    private quartoService: QuartoService,
    private reservaService: ReservaService,
  ) { }

  hospedagemForm: FormGroup;

  hospedagem: Hospedagem;
  hospedagens: Hospedagem[] = [];

  hospedes: Hospede[] = [];
  quartos: Quarto[] = [];
  reservas: Reserva[] = [];

  edit = false;

  // mockHospedagem: Hospedagem[] = [
  //   {
  //     id: 1,
  //     nome: 'Matheus',
  //     email: 'matheus@yahoo.com.br',
  //     rg: '321',
  //     cpf: '123',
  //     dataNasc: '31-10-1995',
  //     telefone: '12-95123123'
  //     },
  // ];

  dataSource = new MatTableDataSource<Hospedagem>(this.hospedagens); //caso utilizar mock, alterar o this.hospedagens pelo mock
  columnsToDisplay = [
    'hospedeId',
    'reservaId',
    'quartoId',
    'dataEntrada',
    'dataSaida',
    'valorHospedagem',
    'observacao',
    'editar',
    'excluir'
  ];

  ngOnInit(): void {
    this.iniciaForm();
    this.getHospedagens();
    this.getHospedes();
    this.getQuartos();
    this.getReservas();
  }

  getHospedagens(): void {
    this.hospedagens.push(new Hospedagem());
    this.dataSource.data = this.hospedagens;
    this.hospedagemService.getAll().subscribe(
      (hospedagens) => {
        this.hospedagens = hospedagens;
        this.dataSource.data = this.hospedagens;
      },
      (err) => {
        this.toastr.error(`Falha ao carregar Hospedagens.`);
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

  getQuartos(): void {
    this.quartoService.getAll().subscribe(quartos => {
      this.quartos = quartos;
    }, (err) => {
      this.toastr.error('Falha ao carregar quartos');
      console.log(err);
      }
    );
  }

  getReservas(): void {
    this.reservaService.getAll().subscribe(reservas => {
      this.reservas = reservas;
    }, (err) => {
      this.toastr.error('Falha ao carregar reservas');
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

  adicionarHospedagem(modalHospedagem): void {
    this.hospedagem = new Hospedagem();
    this.iniciaForm();
    const dialogRef = this.dialog.open(modalHospedagem, {
      width: '550px'
    });
  }

   onClickFechar(): void {
     this.dialog.closeAll();

   }

  onSubmit(): void {

    if (this.hospedagemForm.valid) {
      if (!this.edit) {
        console.log(this.hospedagem);
        this.hospedagemService.add(this.hospedagem).subscribe((result) => {
          if (result.success) {
            this.dataSource.data = this.hospedagens;
            this.iniciaForm();
            this.toastr.success(`Hospedagem cadastrado com sucesso!`);
            this.getHospedagens();
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

  iniciaForm() {   //formControlName no html
    this.hospedagemForm = this.formBuilder.group({
      hospedeId: ['', Validators.required],
      reservaId: ['', Validators.required],
      quartoId: ['', Validators.required],
      dataEntrada: ['', Validators.required],
      dataSaida: ['', Validators.required],
      valorHospedagem: ['', Validators.required]
    })
  }


  buttonEdit(element, modalHospedagem, index): void {
    console.log("fecharaqui")

    this.hospedagem = cloneDeep(element);

    // tratativa para pegar a DAta de nascimento anteriomente cadastrada
    // teve que fazer isso pq ela vem como dateTime mas o input é só date.
     this.hospedagem.dataEntrada = `${element.dataEntrada.substr(0, 10)}`;
     this.hospedagem.dataSaida = `${element.dataSaida.substr(0, 10)}`;

    const dialogRef = this.dialog.open(modalHospedagem, {
      width: '550px'
    });
    this.edit = true;
    dialogRef.afterClosed().subscribe((result) => {

      if ((this.hospedagem.hospedeId != element.hospedeId
        || this.hospedagem.reservaId != element.reservaId
        || this.hospedagem.quartoId != element.quartoId
        || this.hospedagem.dataEntrada != element.dataEntrada.substr(0, 10)
        || this.hospedagem.dataSaida != element.dataSaida.substr(0, 10)
        || this.hospedagem.valorHospedagem != element.valorHospedagem
        || this.hospedagem.observacao != element.observacao
      ) && result != false ) {  //quando cancela me retorna falso.
        this.edit = false;

        this.hospedagemService.update(this.hospedagem).subscribe(() => {
            this.getHospedagens();
            this.hospedagemForm.clearValidators();
            this.toastr.success(`Hospedagem editado com sucesso.`);
          },
          (err) => {
            this.toastr.error(`Falha ao editar Hospedagem.`);
            console.log(err);
          });
      }

      else if ((this.hospedagem.hospedeId != element.hospedeId
        || this.hospedagem.reservaId != element.reservaId
        || this.hospedagem.quartoId != element.quartoId
        || this.hospedagem.dataEntrada != element.dataEntrada.substr(0, 10)
        || this.hospedagem.dataSaida != element.dataSaida.substr(0, 10)
        || this.hospedagem.valorHospedagem != element.valorHospedagem
        || this.hospedagem.observacao != element.observacao
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
        this.hospedagemService.delete(element.id).subscribe(
          () => {
            this.getHospedagens();
            this.toastr.success(`Hospedagem excluído com sucesso!`);
          },
          (err) => {
            this.toastr.error(`Falha ao excluir Hospedagem`);
            console.log(err);
          }
        );
      }
    });
  }

  // retornaDuracao(minutos) {
  //   let mins = minutos % 60;
  //   let hora = (minutos - mins) / 60;

  //   if (hora == 0) {
  //     return mins + 'min.';
  //   } else {
  //     return hora + 'h ' + mins + 'm';
  //   }
  // }

  getNomeHospede(id) {
    const hospede = this.hospedes.filter(e => e.id === id);
    return hospede.length === 0 ? 'N/A' : hospede[0].nome;
  }

  getNumeroQuarto(id) {
    const quarto = this.quartos.filter(e => e.id === id);
    return quarto.length === 0 ? 'N/A' : quarto[0].numeroQuarto;
  }

  getNomeReserva(id) {
    const reserva = this.reservas.filter(e => e.id === id);
    return reserva.length === 0 ? 'N/A' : reserva[0].id;
  }
}
