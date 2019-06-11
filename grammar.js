module.exports = grammar({
  name: "tree_sitter_nani_script",
  scopeName: "source.nani",

  rules: {
    program: $ => repeat(choice(
      $.comment,
      $.define,
      $.command_line,
      $.label,
      $.inline_command,
    )),
    
    label: $ => seq($.label_sign, $._hor_space, $.label_name, optional($._hor_space)),
    label_name: $ => /\w+/,
    label_sign: $ => '#',

    comment: $ => seq(/;.*/, optional($._hor_space)),

    define: $ => seq($.define_sign, $.define_name, $._hor_space, $.define_val, optional($._hor_space)),
    define_name: $ => /\w+/,
    define_val: $ => /[^\n\[\]]+/,
    define_sign: $ => '>',

    command_line: $ => seq(
        $._non_inlined_name,
        optional(seq($._hor_space, $.unnamed_arg)),
        repeat(seq($._hor_space, $.named_arg)),
        optional($._hor_space)
    ),

    inline_command: $ => seq(
        '[',
        $.command_name,
        optional(seq($._hor_space, $.unnamed_arg)),
        repeat(seq($._hor_space, $.named_arg)),
        optional($._hor_space),
        ']'
    ),

    _non_inlined_name: $ => seq(
      '@', $.command_name,
    ),

    command_name: $ => /\w+/,
    unnamed_arg: $ => token(
      choice(
        /[^"\n\s:\[\]@]+/,
        seq(
          '"', /[^\n\[\]]*/, '"'
        ),
      )
    ),

    // named_arg: $ => seq(
    //   $.named_arg_name,
    //   ':',
    //   $.named_arg_val
    // ),
    
    named_arg: $ => token(
      seq(
        /[a-zA-Z0-9_]+/, 
        ':', 
        choice(
          /[^\n\s:\[\]]+/, 
          seq(
            '"', /[^\n\[\]]*/, '"'
          ),
        )
      )
    ),

    _hor_space: $ => /[ \t]+/
  }
});
