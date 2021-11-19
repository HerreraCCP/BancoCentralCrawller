class MyRegex {
  init(value) {
    this.value = value;

    this.MatchesAnyWordCharacter(this.value);
    this.MatchesAnyWordCharacterIsNotDigit(this.value);
    this.MatchBcbWordCharacter(this.value);
  }

  MatchesAnyWordCharacter(value) {
    //\w ==> Matches any word character (alphanumeric & underscore). Only matches low-ascii characters (no accented or non-roman characters). Equivalent to [A-Za-z0-9_]
    const pattern = /\w/g;
    const _value = value;
  }

  MatchesAnyWordCharacterIsNotDigit(value) {
    //\D ==> Matches any character that is not a digit character (0-9). Equivalent to [^0-9].
    const pattern = /\D/g;
    const _value = value;
  }

  MatchBcbWordCharacter(value) {
    // \W =>> Matches any character that is not a word character (alphanumeric & underscore). Equivalent to [^A-Za-z0-9_]
    //  * =>> Quantifier
    // () =>> Creates a capturing group that can be referenced via the specified name.
    const result = [];
    const pattern = new RegExp(/\W*(sitebcb)\W*(modaldados)/g);

    if (pattern.test(value)) {
      console.warn('<== MatchBcbWordCharacter ==>', value);
      result.push(value);
    }

    return result;
  }

  //to do realizar o match
  // const pattern0 = /\<([^\>]+)\>/g;
  // const pattern1 = /(card.details)\w+/g;
  // const pattern4 = /\s/g;
  // const pattern5 = /(\W+)/g;
  // const pattern6 = /(\in)/g;
  // const pattern7 = /\D+/g;
  // const pattern8 = /<strong>(.|\n)*?<\/strong>/g;
  // const pattern9 = /(.|\n)*( )+/g;
}
module.exports = new MyRegex();
