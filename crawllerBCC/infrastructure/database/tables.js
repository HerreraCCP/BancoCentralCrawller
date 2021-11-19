class Tables {
  init(connection) {
    this.connection = connection;

    this.createImageTable();
    this.createBrazilianPlan();
    this.createFaceValue();
    this.createCirculationPeriod();
    this.createMeasures();
    this.createComposition();
    this.createRADescription();
    this.createMintage();
    this.createYearOfProduction();
    this.createCode();
    this.alterTables();
  }

  createImagesTable() {
    const sql =
      'CREATE TABLE IF NOT EXISTS Images' +
      '(idImages int NOT NULL AUTO_INCREMENT,' +
      'Image BLOB,' +
      'Observarion varchar(200), PRIMARY KEY (idImages))';

    this.connection.query(sql, (error) => {
      //colocar log de erro
      if (error) console.log(error);
      else console.log('Tabela BrazilianPlan foi criada com sucesso');
    });
  }

  // Tipo de Plano => Real, Cruzeiro, etc...
  createBrazilianPlan() {
    const sql =
      'CREATE TABLE IF NOT EXISTS BrazilianPlan' +
      '(idBrazilianPlan int NOT NULL AUTO_INCREMENT,' +
      'Type varchar(50),' +
      'Observarion varchar(200), PRIMARY KEY (idBrazilianPlan))';

    this.connection.query(sql, (error) => {
      //colocar log de erro
      if (error) console.log(error);
      else console.log('Tabela BrazilianPlan foi criada com sucesso');
    });
  }

  //1, 5, 10 reais
  createFaceValue() {
    const sql =
      'CREATE TABLE IF NOT EXISTS FaceValue' +
      '(idFaceValue int NOT NULL AUTO_INCREMENT,' +
      'idBrazilianPlan int,' +
      'idCirculationPeriod int,' +
      'idMeasures int,' +
      'idComposition int,' +
      'idRADescription int,' +
      'idYearOfProduction int,' +
      'Observarion varchar(200), PRIMARY KEY (idFaceValue))';

    this.connection.query(sql, (error) => {
      //colocar log de erro
      if (error) console.log(error);
      else console.log('Tabela BrazilianPlan foi criada com sucesso');
    });
  }

  //Em circulação a partir de 1º/7/1998
  createCirculationPeriod() {
    const sql =
      'CREATE TABLE IF NOT EXISTS CirculationPeriod' +
      '(idCirculationPeriod int NOT NULL AUTO_INCREMENT,' +
      'Period varchar(100),' +
      'Observarion varchar(200), PRIMARY KEY (idCirculationPeriod))';

    this.connection.query(sql, (error) => {
      //colocar log de erro
      if (error) console.log(error);
      else console.log('Tabela CirculationPeriod foi criada com sucesso');
    });
  }

  //Diâmetro(mm):27,0 <-> Peso(g):7,84 <-> Espessura(mm):	1,95
  createMeasures() {
    const sql =
      'CREATE TABLE IF NOT EXISTS Measures' +
      '(idMeasures int NOT NULL AUTO_INCREMENT,' +
      'Weight varchar(20),' +
      'Diameter varchar(20),' +
      'Thickness varchar(20),' +
      'Description varchar(200),' +
      'PRIMARY KEY (idMeasures) )';

    this.connection.query(sql, (error) => {
      //colocar log de erro
      if (error) console.log(error);
      else console.log('Tabela Measures foi criada com sucesso');
    });
  }

  //Cuproníquel (núcleo) e Alpaca (anel)
  createComposition() {
    const sql =
      'CREATE TABLE IF NOT EXISTS Composition' +
      '(idComposition int NOT NULL AUTO_INCREMENT, Material varchar(100),' +
      'Description varchar(200), PRIMARY KEY (idComposition))';

    this.connection.query(sql, (error) => {
      //colocar log de erro
      if (error) console.log(error);
      else console.log('Tabela Composition foi criada com sucesso');
    });
  }

  //Anverso: Efígie da República, desenhos indígenas no anel e dístico BRASIL.
  //Reverso: Valor, data e alusão ao Pavilhão Nacional; desenhos indígenas no anel.
  createRADescription() {
    const sql =
      'CREATE TABLE IF NOT EXISTS RADescription' +
      '(idRADescription int NOT NULL AUTO_INCREMENT,' +
      'Anverso varchar(100),' +
      'Reverso varchar(100),' +
      'Observarion varchar(200), PRIMARY KEY (idRADescription))';

    this.connection.query(sql, (error) => {
      //colocar log de erro
      if (error) console.log(error);
      else console.log('Tabela RADescription foi criada com sucesso');
    });
  }

  //tiragem
  createMintage() {
    const sql =
      'CREATE TABLE IF NOT EXISTS Mintage' +
      '(idMintage int NOT NULL AUTO_INCREMENT,' +
      'Mintage varchar(100),' +
      'Observarion varchar(200), PRIMARY KEY (idMintage))';

    this.connection.query(sql, (error) => {
      //colocar log de erro
      if (error) console.log(error);
      else console.log('Tabela Mintage foi criada com sucesso');
    });
  }

  //2002
  createYearOfProduction() {
    const sql =
      'CREATE TABLE IF NOT EXISTS YearOfProduction' +
      '(idYearOfProduction int NOT NULL AUTO_INCREMENT,' +
      'idMintage int,' +
      'idCode int,' +
      'Observarion varchar(200), PRIMARY KEY (idYearOfProduction))';

    this.connection.query(sql, (error) => {
      //colocar log de erro
      if (error) console.log(error);
      else console.log('Tabela YearOfProduction foi criada com sucesso');
    });
  }

  //Cz-8
  createCode() {
    const sql =
      'CREATE TABLE IF NOT EXISTS Code' +
      '(idCode int NOT NULL AUTO_INCREMENT,' +
      'Code varchar(100),' +
      'Observarion varchar(200), PRIMARY KEY (idCode))';

    this.connection.query(sql, (error) => {
      //colocar log de erro
      if (error) console.log(error);
      else console.log('Tabela Code foi criada com sucesso');
    });
  }

  alterTables() {
    const result = [];
    const alter0 = `ALTER TABLE 'FaceValue' ADD CONSTRAINT 'idImages' FOREIGN KEY ( 'idImages' ); REFERENCES 'Images' ( 'idImages')`;
    const alter1 = `ALTER TABLE 'FaceValue' ADD CONSTRAINT 'idBrazilianPlan' FOREIGN KEY ( 'idBrazilianPlan' ); REFERENCES 'BrazilianPlan' ( 'idBrazilianPlan')`;
    const alter2 = `ALTER TABLE 'FaceValue' ADD CONSTRAINT 'idCirculationPeriod' FOREIGN KEY ( 'idCirculationPeriod' ); REFERENCES 'CirculationPeriod' ( 'idCirculationPeriod')`;
    const alter3 = `ALTER TABLE 'FaceValue' ADD CONSTRAINT 'idMeasures' FOREIGN KEY ( 'idMeasures' ); REFERENCES 'Measures' ( 'idMeasures')`;
    const alter4 = `ALTER TABLE 'FaceValue' ADD CONSTRAINT 'idComposition' FOREIGN KEY ( 'idComposition' ); REFERENCES 'Composition' ( 'idComposition')`;
    const alter5 = `ALTER TABLE 'FaceValue' ADD CONSTRAINT 'idRADescription' FOREIGN KEY ( 'idRADescription' ); REFERENCES 'RADescription' ( 'idRADescription')`;
    const alter6 = `ALTER TABLE 'FaceValue' ADD CONSTRAINT 'idYearOfProduction' FOREIGN KEY ( 'idYearOfProduction' ); REFERENCES 'YearOfProduction' ( 'idYearOfProduction')`;
    const alter7 = `ALTER TABLE 'YearOfProduction' ADD CONSTRAINT 'idMintage' FOREIGN KEY ( 'idMintage' ); REFERENCES 'Mintage' ( 'idMintage')`;
    const alter8 = `ALTER TABLE 'YearOfProduction' ADD CONSTRAINT 'idCode' FOREIGN KEY ( 'idCode' ); REFERENCES 'Code' ( 'idCode')`;

    result.push({
      alter0,
      alter1,
      alter2,
      alter3,
      alter4,
      alter5,
      alter6,
      alter7,
      alter8,
    });

    this.connection.query(
      result.forEach((element) => {
        element;
      }),
      (error) => {
        //colocar log de erro
        if (error) console.log(error);
        else console.log('Alter Table funfou');
      }
    );
  }
}

module.exports = new Tables();
