class Tables {
  init(connection) {
    this.connection = connection;
    this.createBrazilianPlan();
    this.createFaceValue();
    this.createCirculationPeriod();
    this.createMeasures();
    this.createComposition();
    this.createRADescription();
    this.createMintage();
    this.createYearOfProduction();
    this.createCode();
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
      'Value varchar(50),' +
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
      'Year varchar(100),' +
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
}

module.exports = new Tables();
