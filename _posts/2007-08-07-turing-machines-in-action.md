---
layout: post
title:  "Turing Machines in Action"
date:   2007-08-07 01:00:00
excerpt: "In this post I will define turing machines and demonstrate a simple one in action."
categories: Computing
tags:  Coding Python Theory Computer-Science
image:
  feature: machine.jpg
  topPosition: -100
bgContrast: dark
bgGradientOpacity: darker
syntaxHighlighter: yes
---
In this post I will define [Turing Machines](https://en.wikipedia.org/wiki/Turing_machine), provide an emulator for Turing Machines, and demonstrate a couple of simple ones in action.

### Definition of a Turing Machine

A ***turing machine*** (***TM***)'s ***description*** consists of a tuple of *7* objects: a set of states *Q*, an input alphabet *I*, a tape alphabet *T*, a transition function *F*, a set of accept states $$Q_{accept}$$, a set of reject states $$Q_{reject}$$ and a start state $$Q_{start}$$.

The following requirements must hold:
* *I* is contained in *T*.
* \' \' (the space symbol) is a member of *T*, but not of *I*.
* *F* is a function from $$Q \times T \rightarrow Q \times T \times \{1,-1\}$$.
* $$Q_{accept}$$ and $$Q_{reject}$$ are disjoint subsets of *Q*.
* $$Q_{start} \in Q$$.

The turing machine itself consists of: its *description* (as defined above), an *infinite tape*, a *head*, and a *current state*.

The ***tape*** is an infinite list of symbols from *T* (it is only infinite to the right, i.e. it has indices 0, 1, 2, ... but no negative indexes). The tape initially contains the input (a string of symbols from *I*) starting at index 0 followed by infinitely many \' \' (space) symbols. As we required that the \' \' symbol is not a member of *I*, the *TM* can detect the end of the input.

The ***head*** is simply a pointer to the tape. It initially points to tape position 0.

The ***current state*** (denoted below by *current_state*) is a member of *Q*, and is initialized to $$Q_{start}$$.

### Operation

A *TM* with a description $$\{Q, I, T, F, Q_{accept}, Q_{reject}, Q_{start}\}$$ is initialized as indicated above. The result of its operation consists of the contents of the tape as well as an additional flag which can be either *ACCEPT* or *REJECT*. In the description below, the action accept means setting this flag to the *ACCEPT* state and halting. The same goes for the reject action.

The TM operates as follows:
* If $$\text{current_state} \in Q_{accept}$$, accept.
* If $$\text{current_state} \in Q_{reject}$$, reject.
* Read a symbol from the tape at the position indicated by the head. Denote it as current_symbol.
* Set *next_state*, *next_symbol*, *next_head_pos* to *F(current_state, current_symbol)*.
* Write *next_symbol* to the tape at the current head position.
* If *next_head_pos* is 1 move the head one position to the right.
* If *next_head_pos* is -1 move the head one position to the left (if the head tries to move to the left from position 0, do not move the head).
* Set *current_state* to *next_state*.

And that’s it!

### First Example: Unary Multiplication

The following is the description of a *TM* that multiplies two integers in unary notation. For example, if its input is of the form '111\*11=' it will *accept* with an output tape of '111\*11=111111'.

> If you feel adventurous, stop reading now and try to implement this machine yourself.

#### The Machine Description

The format of the description below is hopefully self explanatory. It consists of some nested python dictionaries, and can be fed into my Python TM Emulator&trade; (the code of which is included at the end of this article).

```python
TMUnaryMultiply = {
    'description' : """The input must be of the form '11*111='. The output tape will look like '11*111=111111'.""",
    'start_state' : 'mark_start',
#input verification
    'mark_start' :
        {
            '1':['verify_input_1','#',1],
        },
    'verify_input_1' :
        {
            '1':['verify_input_1','1',1],
            '*':['verify_input_*','*',1]
        },
    'verify_input_*' :
        {
            '1':['verify_input_2','1',1]
        },
    'verify_input_2' :
        {
            '1':['verify_input_2','1',1],
            '=':['verify_input_ ','=',1]
        },
    'verify_input_ ' :
        {
            ' ':['move_head_to_left',' ',-1]
        },
    'move_head_to_left':
        {
            '1':['move_head_to_left','1',-1],
            '=':['move_head_to_left','=',-1],
            '*':['move_head_to_left','*',-1],
            '#':['read_ones','1',-1] # this will try to move the head off the tape
        },
# actual multiplication
    'read_ones' :
        {
            '1':['wait_for_*', '#', 1],
            '*':['halt','*', -1],
        },
    'wait_for_*' :
        {
            '1':['wait_for_*', '1', 1],
            '*':['copy_ones', '*', 1]
        },
    'copy_ones' :
        {
            '1':['wait_for_=', '#', 1],
            '=':['move_left2','=', -1],
        },
    'wait_for_=' :
        {
            '1':['wait_for_=','1',1],
            '=':['wait_for_ ','=',1]
        },
    'wait_for_ ' :
        {
            '1':['wait_for_ ','1',1],
            ' ':['move_left','1',-1]
        },
    'move_left':
        {
            '1':['move_left','1',-1],
            '=':['move_left','=',-1],
            '#':['copy_ones','1', 1]
        },
    'move_left2':
        {
            '1':['move_left2','1',-1],
            '*':['move_left2','*',-1],
            '#':['read_ones','1', 1]
        },
    'halt' : {}
}
```

#### Output

Running the emulator (in verbose mode) with the TMUnaryMultiply description above on the input '111\*11=' results in the following:

```python
Initialing TM [The input must be of the form '11*111='. The output tape will look like '11*111=111111'.]...
Running tm with input [111*11=]...
                          V
<          mark_start>: ['1', '1', '1', '*', '1', '1', '=', ' ']
                               V
<      verify_input_1>: ['#', '1', '1', '*', '1', '1', '=', ' ']
                                    V
<      verify_input_1>: ['#', '1', '1', '*', '1', '1', '=', ' ']
                                         V
<      verify_input_1>: ['#', '1', '1', '*', '1', '1', '=', ' ']
                                              V
<      verify_input_*>: ['#', '1', '1', '*', '1', '1', '=', ' ']
                                                   V
<      verify_input_2>: ['#', '1', '1', '*', '1', '1', '=', ' ']
                                                        V
<      verify_input_2>: ['#', '1', '1', '*', '1', '1', '=', ' ']
                                                             V
<      verify_input_ >: ['#', '1', '1', '*', '1', '1', '=', ' ']
                                                        V
<   move_head_to_left>: ['#', '1', '1', '*', '1', '1', '=', ' ']
                                                   V
<   move_head_to_left>: ['#', '1', '1', '*', '1', '1', '=', ' ']
                                              V
<   move_head_to_left>: ['#', '1', '1', '*', '1', '1', '=', ' ']
                                         V
<   move_head_to_left>: ['#', '1', '1', '*', '1', '1', '=', ' ']
                                    V
<   move_head_to_left>: ['#', '1', '1', '*', '1', '1', '=', ' ']
                               V
<   move_head_to_left>: ['#', '1', '1', '*', '1', '1', '=', ' ']
                          V
<   move_head_to_left>: ['#', '1', '1', '*', '1', '1', '=', ' ']
                          V
<           read_ones>: ['1', '1', '1', '*', '1', '1', '=', ' ']
                               V
<          wait_for_*>: ['#', '1', '1', '*', '1', '1', '=', ' ']
                                    V
<          wait_for_*>: ['#', '1', '1', '*', '1', '1', '=', ' ']
                                         V
<          wait_for_*>: ['#', '1', '1', '*', '1', '1', '=', ' ']
                                              V
<           copy_ones>: ['#', '1', '1', '*', '1', '1', '=', ' ']
                                                   V
<          wait_for_=>: ['#', '1', '1', '*', '#', '1', '=', ' ']
                                                        V
<          wait_for_=>: ['#', '1', '1', '*', '#', '1', '=', ' ']
                                                             V
<          wait_for_ >: ['#', '1', '1', '*', '#', '1', '=', ' ']
                                                        V
<           move_left>: ['#', '1', '1', '*', '#', '1', '=', '1']
                                                   V
<           move_left>: ['#', '1', '1', '*', '#', '1', '=', '1']
                                              V
<           move_left>: ['#', '1', '1', '*', '#', '1', '=', '1']
                                                   V
<           copy_ones>: ['#', '1', '1', '*', '1', '1', '=', '1']
                                                        V
<          wait_for_=>: ['#', '1', '1', '*', '1', '#', '=', '1']
                                                             V
<          wait_for_ >: ['#', '1', '1', '*', '1', '#', '=', '1']
                                                                  V
<          wait_for_ >: ['#', '1', '1', '*', '1', '#', '=', '1', ' ']
                                                             V
<           move_left>: ['#', '1', '1', '*', '1', '#', '=', '1', '1']
                                                        V
<           move_left>: ['#', '1', '1', '*', '1', '#', '=', '1', '1']
                                                   V
<           move_left>: ['#', '1', '1', '*', '1', '#', '=', '1', '1']
                                                        V
<           copy_ones>: ['#', '1', '1', '*', '1', '1', '=', '1', '1']
                                                   V
<          move_left2>: ['#', '1', '1', '*', '1', '1', '=', '1', '1']
                                              V
<          move_left2>: ['#', '1', '1', '*', '1', '1', '=', '1', '1']
                                         V
<          move_left2>: ['#', '1', '1', '*', '1', '1', '=', '1', '1']
                                    V
<          move_left2>: ['#', '1', '1', '*', '1', '1', '=', '1', '1']
                               V
<          move_left2>: ['#', '1', '1', '*', '1', '1', '=', '1', '1']
                          V
<          move_left2>: ['#', '1', '1', '*', '1', '1', '=', '1', '1']
                               V
<           read_ones>: ['1', '1', '1', '*', '1', '1', '=', '1', '1']
                                    V
<          wait_for_*>: ['1', '#', '1', '*', '1', '1', '=', '1', '1']
                                         V
<          wait_for_*>: ['1', '#', '1', '*', '1', '1', '=', '1', '1']
                                              V
<           copy_ones>: ['1', '#', '1', '*', '1', '1', '=', '1', '1']
                                                   V
<          wait_for_=>: ['1', '#', '1', '*', '#', '1', '=', '1', '1']
                                                        V
<          wait_for_=>: ['1', '#', '1', '*', '#', '1', '=', '1', '1']
                                                             V
<          wait_for_ >: ['1', '#', '1', '*', '#', '1', '=', '1', '1']
                                                                  V
<          wait_for_ >: ['1', '#', '1', '*', '#', '1', '=', '1', '1']
                                                                       V
<          wait_for_ >: ['1', '#', '1', '*', '#', '1', '=', '1', '1', ' ']
                                                                  V
<           move_left>: ['1', '#', '1', '*', '#', '1', '=', '1', '1', '1']
                                                             V
<           move_left>: ['1', '#', '1', '*', '#', '1', '=', '1', '1', '1']
                                                        V
<           move_left>: ['1', '#', '1', '*', '#', '1', '=', '1', '1', '1']
                                                   V
<           move_left>: ['1', '#', '1', '*', '#', '1', '=', '1', '1', '1']
                                              V
<           move_left>: ['1', '#', '1', '*', '#', '1', '=', '1', '1', '1']
                                                   V
<           copy_ones>: ['1', '#', '1', '*', '1', '1', '=', '1', '1', '1']
                                                        V
<          wait_for_=>: ['1', '#', '1', '*', '1', '#', '=', '1', '1', '1']
                                                             V
<          wait_for_ >: ['1', '#', '1', '*', '1', '#', '=', '1', '1', '1']
                                                                  V
<          wait_for_ >: ['1', '#', '1', '*', '1', '#', '=', '1', '1', '1']
                                                                       V
<          wait_for_ >: ['1', '#', '1', '*', '1', '#', '=', '1', '1', '1']
                                                                            V
<          wait_for_ >: ['1', '#', '1', '*', '1', '#', '=', '1', '1', '1', ' ']
                                                                       V
<           move_left>: ['1', '#', '1', '*', '1', '#', '=', '1', '1', '1', '1']
                                                                  V
<           move_left>: ['1', '#', '1', '*', '1', '#', '=', '1', '1', '1', '1']
                                                             V
<           move_left>: ['1', '#', '1', '*', '1', '#', '=', '1', '1', '1', '1']
                                                        V
<           move_left>: ['1', '#', '1', '*', '1', '#', '=', '1', '1', '1', '1']
                                                   V
<           move_left>: ['1', '#', '1', '*', '1', '#', '=', '1', '1', '1', '1']
                                                        V
<           copy_ones>: ['1', '#', '1', '*', '1', '1', '=', '1', '1', '1', '1']
                                                   V
<          move_left2>: ['1', '#', '1', '*', '1', '1', '=', '1', '1', '1', '1']
                                              V
<          move_left2>: ['1', '#', '1', '*', '1', '1', '=', '1', '1', '1', '1']
                                         V
<          move_left2>: ['1', '#', '1', '*', '1', '1', '=', '1', '1', '1', '1']
                                    V
<          move_left2>: ['1', '#', '1', '*', '1', '1', '=', '1', '1', '1', '1']
                               V
<          move_left2>: ['1', '#', '1', '*', '1', '1', '=', '1', '1', '1', '1']
                                    V
<           read_ones>: ['1', '1', '1', '*', '1', '1', '=', '1', '1', '1', '1']
                                         V
<          wait_for_*>: ['1', '1', '#', '*', '1', '1', '=', '1', '1', '1', '1']
                                              V
<           copy_ones>: ['1', '1', '#', '*', '1', '1', '=', '1', '1', '1', '1']
                                                   V
<          wait_for_=>: ['1', '1', '#', '*', '#', '1', '=', '1', '1', '1', '1']
                                                        V
<          wait_for_=>: ['1', '1', '#', '*', '#', '1', '=', '1', '1', '1', '1']
                                                             V
<          wait_for_ >: ['1', '1', '#', '*', '#', '1', '=', '1', '1', '1', '1']
                                                                  V
<          wait_for_ >: ['1', '1', '#', '*', '#', '1', '=', '1', '1', '1', '1']
                                                                       V
<          wait_for_ >: ['1', '1', '#', '*', '#', '1', '=', '1', '1', '1', '1']
                                                                            V
<          wait_for_ >: ['1', '1', '#', '*', '#', '1', '=', '1', '1', '1', '1']
                                                                                 V
<          wait_for_ >: ['1', '1', '#', '*', '#', '1', '=', '1', '1', '1', '1', ' ']
                                                                            V
<           move_left>: ['1', '1', '#', '*', '#', '1', '=', '1', '1', '1', '1', '1']
                                                                       V
<           move_left>: ['1', '1', '#', '*', '#', '1', '=', '1', '1', '1', '1', '1']
                                                                  V
<           move_left>: ['1', '1', '#', '*', '#', '1', '=', '1', '1', '1', '1', '1']
                                                             V
<           move_left>: ['1', '1', '#', '*', '#', '1', '=', '1', '1', '1', '1', '1']
                                                        V
<           move_left>: ['1', '1', '#', '*', '#', '1', '=', '1', '1', '1', '1', '1']
                                                   V
<           move_left>: ['1', '1', '#', '*', '#', '1', '=', '1', '1', '1', '1', '1']
                                              V
<           move_left>: ['1', '1', '#', '*', '#', '1', '=', '1', '1', '1', '1', '1']
                                                   V
<           copy_ones>: ['1', '1', '#', '*', '1', '1', '=', '1', '1', '1', '1', '1']
                                                        V
<          wait_for_=>: ['1', '1', '#', '*', '1', '#', '=', '1', '1', '1', '1', '1']
                                                             V
<          wait_for_ >: ['1', '1', '#', '*', '1', '#', '=', '1', '1', '1', '1', '1']
                                                                  V
<          wait_for_ >: ['1', '1', '#', '*', '1', '#', '=', '1', '1', '1', '1', '1']
                                                                       V
<          wait_for_ >: ['1', '1', '#', '*', '1', '#', '=', '1', '1', '1', '1', '1']
                                                                            V
<          wait_for_ >: ['1', '1', '#', '*', '1', '#', '=', '1', '1', '1', '1', '1']
                                                                                 V
<          wait_for_ >: ['1', '1', '#', '*', '1', '#', '=', '1', '1', '1', '1', '1']
                                                                                      V
<          wait_for_ >: ['1', '1', '#', '*', '1', '#', '=', '1', '1', '1', '1', '1', ' ']
                                                                                 V
<           move_left>: ['1', '1', '#', '*', '1', '#', '=', '1', '1', '1', '1', '1', '1']
                                                                            V
<           move_left>: ['1', '1', '#', '*', '1', '#', '=', '1', '1', '1', '1', '1', '1']
                                                                       V
<           move_left>: ['1', '1', '#', '*', '1', '#', '=', '1', '1', '1', '1', '1', '1']
                                                                  V
<           move_left>: ['1', '1', '#', '*', '1', '#', '=', '1', '1', '1', '1', '1', '1']
                                                             V
<           move_left>: ['1', '1', '#', '*', '1', '#', '=', '1', '1', '1', '1', '1', '1']
                                                        V
<           move_left>: ['1', '1', '#', '*', '1', '#', '=', '1', '1', '1', '1', '1', '1']
                                                   V
<           move_left>: ['1', '1', '#', '*', '1', '#', '=', '1', '1', '1', '1', '1', '1']
                                                        V
<           copy_ones>: ['1', '1', '#', '*', '1', '1', '=', '1', '1', '1', '1', '1', '1']
                                                   V
<          move_left2>: ['1', '1', '#', '*', '1', '1', '=', '1', '1', '1', '1', '1', '1']
                                              V
<          move_left2>: ['1', '1', '#', '*', '1', '1', '=', '1', '1', '1', '1', '1', '1']
                                         V
<          move_left2>: ['1', '1', '#', '*', '1', '1', '=', '1', '1', '1', '1', '1', '1']
                                    V
<          move_left2>: ['1', '1', '#', '*', '1', '1', '=', '1', '1', '1', '1', '1', '1']
                                         V
<           read_ones>: ['1', '1', '1', '*', '1', '1', '=', '1', '1', '1', '1', '1', '1']
accept
```

### Turing Machine Emulator

Here is the code of my Python TM Emulator:

```python
class TM:
    def __init__(self, states, accept_states, reject_states):
        print 'Initialing TM [%s]...' % (states['description'])
        self.states = states
        self.accept_states = accept_states
        self.reject_states = reject_states
        self.halt_states = accept_states + reject_states
def run(self, input,verbose=False):
        head_pos = 0
        current = self.states['start_state']
        tape = [x for x in input]+[" "]
        while current not in self.halt_states:
            if verbose:
                print ' '*(22+1+1+1+5*(head_pos)+1)+'V'
                print '<%20s>: %s' % (current, tape)
            try:
                next_state, next_symbol, head_movement = self.states[current][tape[head_pos]]
            except KeyError:
                return "reject"
            tape[head_pos] = next_symbol
            head_pos += head_movement
            if head_pos < 0:
                head_pos = 0
            elif head_pos == len(tape):
                tape.append(" ")
            current = next_state
        print ''.join(tape)
        if current in self.accept_states:
            return 'accept'
        else:
            assert(current in self.reject_states)
            return 'reject'
```

And that of a simple test method:

```python
def test():
    mul = TM(TMUnaryMultiply, ["halt"], [""])
    inputs = ['bad_input','111*11=','1*1=','*1=','1*=','11111111*1111111=']
    for input in inputs:
        print 'Running tm with input [%s]...' % (input)
        print mul.run(input)
```

A sample output:

```python
>>> test()
Initialing TM [The input must be of the form '11*111='. The output tape will look like '11*111=111111'.]...
Running tm with input [bad_input]...
reject
Running tm with input [111*11=]...
111*11=111111
accept
Running tm with input [1*1=]...
1*1=1
accept
Running tm with input [*1=]...
reject
Running tm with input [1*=]...
reject
Running tm with input [11111111*1111111=]...
11111111*1111111=11111111111111111111111111111111111111111111111111111111
accept
```

### Binary Addition

A second, more interesting TM performs binary addition:

```python
TMBinaryAddReverse = {
    'description' : """The input must be of the form '1010+0010=' (i.e. in reversed binary notation, operands of same size padded with an extra 0). The output will look like '1010+0010=1110'.""",
    'start_state' : 'mark_start_carry_0',
    'halt': {},
    'mark_start_carry_0' :
    {
        '1':['sum_1','#',1],
        '0':['sum_0','#',1],
        '+':['halt','+',1]
    },
    'mark_start_carry_1' :
    {
        '1':['sum_2','#',1],
        '0':['sum_1','#',1],
        '+':['halt','+',1]
    },
    'sum_0' :
    {
        '1':['sum_0','1',1],
        '0':['sum_0','0',1],
        '+':['sum_0_get_next','+',1],
        '=':['write_0','=',1],
    },
    'sum_1' :
    {
        '1':['sum_1','1',1],
        '0':['sum_1','0',1],
        '+':['sum_1_get_next','+',1],
        '=':['write_1','=',1],
    },
    'sum_2' :
    {
        '1':['sum_2','1',1],
        '0':['sum_2','0',1],
        '+':['sum_2_get_next','+',1],
        '=':['write_2','=',1],
    },
    'sum_3' :
    {
        '1':['sum_3','1',1],
        '0':['sum_3','0',1],
        '=':['write_3','=',1],
    },
    'sum_1_get_next':
    {
        '#':['sum_1_get_next','#',1],
        '1':['sum_2','#',1],
        '0':['sum_1','#',1],
    },
    'sum_0_get_next':
    {
        '#':['sum_0_get_next','#',1],
        '1':['sum_1','#',1],
        '0':['sum_0','#',1],
    },
    'sum_2_get_next':
    {
        '#':['sum_2_get_next','#',1],
        '1':['sum_3','#',1],
        '0':['sum_2','#',1],
    },
    'write_0':
    {
        '1':['write_0','1',1],
        '0':['write_0','0',1],
        ' ':['move_left_carry_0','0',-1],
    },
    'write_1':
    {
        '1':['write_1','1',1],
        '0':['write_1','0',1],
        ' ':['move_left_carry_0','1',-1],
    },
    'write_2':
    {
        '1':['write_2','1',1],
        '0':['write_2','0',1],
        ' ':['move_left_carry_1','0',-1],
    },
    'write_3':
    {
        '1':['write_3','1',1],
        '0':['write_3','0',1],
        ' ':['move_left_carry_1','1',-1],
    },
    'move_left_carry_0':
    {
        '0':['move_left_carry_0','0',-1],       
        '1':['move_left_carry_0','1',-1],       
        '=':['move_left_carry_0','=',-1],       
        '#':['move_left_carry_0','#',-1],       
        '+':['move_left_carry_0_part_2','+',-1],       
    },
    'move_left_carry_1':
    {
        '0':['move_left_carry_1','0',-1],       
        '1':['move_left_carry_1','1',-1],       
        '=':['move_left_carry_1','=',-1],       
        '#':['move_left_carry_1','#',-1],       
        '+':['move_left_carry_1_part_2','+',-1],       
    },
    'move_left_carry_0_part_2':
    {
        '0':['move_left_carry_0_part_2','0',-1],       
        '1':['move_left_carry_0_part_2','1',-1],
        '#':['mark_start_carry_0','#',1],
    },
    'move_left_carry_1_part_2':
    {
        '0':['move_left_carry_1_part_2','0',-1],       
        '1':['move_left_carry_1_part_2','1',-1],
        '#':['mark_start_carry_1','#',1],
    },
}
```

#### Output

Here is the output of a sample run:

```python
>>> mul = TM(TMBinaryAddReverse, ["halt"], [])
Initialing TM [The input must be of the form '1010+0010=' (i.e. in reversed binary notation, operands of same size padded with an extra 0). The output will look like '1010+0010=1110'.]...
>>> mul.run('1110+1100=',True)
                                  V
<mark_start_carry_0>          : ['1', '1', '1', '0', '+', '1', '1', '0', '0', '=', ' ']
                                       V
<sum_1>                       : ['#', '1', '1', '0', '+', '1', '1', '0', '0', '=', ' ']
                                            V
<sum_1>                       : ['#', '1', '1', '0', '+', '1', '1', '0', '0', '=', ' ']
                                                 V
<sum_1>                       : ['#', '1', '1', '0', '+', '1', '1', '0', '0', '=', ' ']
                                                      V
<sum_1>                       : ['#', '1', '1', '0', '+', '1', '1', '0', '0', '=', ' ']
                                                           V
<sum_1_get_next>              : ['#', '1', '1', '0', '+', '1', '1', '0', '0', '=', ' ']
                                                                V
<sum_2>                       : ['#', '1', '1', '0', '+', '#', '1', '0', '0', '=', ' ']
                                                                     V
<sum_2>                       : ['#', '1', '1', '0', '+', '#', '1', '0', '0', '=', ' ']
                                                                          V
<sum_2>                       : ['#', '1', '1', '0', '+', '#', '1', '0', '0', '=', ' ']
                                                                               V
<sum_2>                       : ['#', '1', '1', '0', '+', '#', '1', '0', '0', '=', ' ']
                                                                                    V
<write_2>                     : ['#', '1', '1', '0', '+', '#', '1', '0', '0', '=', ' ']
                                                                               V
<move_left_carry_1>           : ['#', '1', '1', '0', '+', '#', '1', '0', '0', '=', '0']
                                                                          V
<move_left_carry_1>           : ['#', '1', '1', '0', '+', '#', '1', '0', '0', '=', '0']
                                                                     V
<move_left_carry_1>           : ['#', '1', '1', '0', '+', '#', '1', '0', '0', '=', '0']
                                                                V
<move_left_carry_1>           : ['#', '1', '1', '0', '+', '#', '1', '0', '0', '=', '0']
                                                           V
<move_left_carry_1>           : ['#', '1', '1', '0', '+', '#', '1', '0', '0', '=', '0']
                                                      V
<move_left_carry_1>           : ['#', '1', '1', '0', '+', '#', '1', '0', '0', '=', '0']
                                                 V
<move_left_carry_1_part_2>    : ['#', '1', '1', '0', '+', '#', '1', '0', '0', '=', '0']
                                            V
<move_left_carry_1_part_2>    : ['#', '1', '1', '0', '+', '#', '1', '0', '0', '=', '0']
                                       V
<move_left_carry_1_part_2>    : ['#', '1', '1', '0', '+', '#', '1', '0', '0', '=', '0']
                                  V
<move_left_carry_1_part_2>    : ['#', '1', '1', '0', '+', '#', '1', '0', '0', '=', '0']
                                       V
<mark_start_carry_1>          : ['#', '1', '1', '0', '+', '#', '1', '0', '0', '=', '0']
                                            V
<sum_2>                       : ['#', '#', '1', '0', '+', '#', '1', '0', '0', '=', '0']
                                                 V
<sum_2>                       : ['#', '#', '1', '0', '+', '#', '1', '0', '0', '=', '0']
                                                      V
<sum_2>                       : ['#', '#', '1', '0', '+', '#', '1', '0', '0', '=', '0']
                                                           V
<sum_2_get_next>              : ['#', '#', '1', '0', '+', '#', '1', '0', '0', '=', '0']
                                                                V
<sum_2_get_next>              : ['#', '#', '1', '0', '+', '#', '1', '0', '0', '=', '0']
                                                                     V
<sum_3>                       : ['#', '#', '1', '0', '+', '#', '#', '0', '0', '=', '0']
                                                                          V
<sum_3>                       : ['#', '#', '1', '0', '+', '#', '#', '0', '0', '=', '0']
                                                                               V
<sum_3>                       : ['#', '#', '1', '0', '+', '#', '#', '0', '0', '=', '0']
                                                                                    V
<write_3>                     : ['#', '#', '1', '0', '+', '#', '#', '0', '0', '=', '0']
                                                                                         V
<write_3>                     : ['#', '#', '1', '0', '+', '#', '#', '0', '0', '=', '0', ' ']
                                                                                    V
<move_left_carry_1>           : ['#', '#', '1', '0', '+', '#', '#', '0', '0', '=', '0', '1']
                                                                               V
<move_left_carry_1>           : ['#', '#', '1', '0', '+', '#', '#', '0', '0', '=', '0', '1']
                                                                          V
<move_left_carry_1>           : ['#', '#', '1', '0', '+', '#', '#', '0', '0', '=', '0', '1']
                                                                     V
<move_left_carry_1>           : ['#', '#', '1', '0', '+', '#', '#', '0', '0', '=', '0', '1']
                                                                V
<move_left_carry_1>           : ['#', '#', '1', '0', '+', '#', '#', '0', '0', '=', '0', '1']
                                                           V
<move_left_carry_1>           : ['#', '#', '1', '0', '+', '#', '#', '0', '0', '=', '0', '1']
                                                      V
<move_left_carry_1>           : ['#', '#', '1', '0', '+', '#', '#', '0', '0', '=', '0', '1']
                                                 V
<move_left_carry_1_part_2>    : ['#', '#', '1', '0', '+', '#', '#', '0', '0', '=', '0', '1']
                                            V
<move_left_carry_1_part_2>    : ['#', '#', '1', '0', '+', '#', '#', '0', '0', '=', '0', '1']
                                       V
<move_left_carry_1_part_2>    : ['#', '#', '1', '0', '+', '#', '#', '0', '0', '=', '0', '1']
                                            V
<mark_start_carry_1>          : ['#', '#', '1', '0', '+', '#', '#', '0', '0', '=', '0', '1']
                                                 V
<sum_2>                       : ['#', '#', '#', '0', '+', '#', '#', '0', '0', '=', '0', '1']
                                                      V
<sum_2>                       : ['#', '#', '#', '0', '+', '#', '#', '0', '0', '=', '0', '1']
                                                           V
<sum_2_get_next>              : ['#', '#', '#', '0', '+', '#', '#', '0', '0', '=', '0', '1']
                                                                V
<sum_2_get_next>              : ['#', '#', '#', '0', '+', '#', '#', '0', '0', '=', '0', '1']
                                                                     V
<sum_2_get_next>              : ['#', '#', '#', '0', '+', '#', '#', '0', '0', '=', '0', '1']
                                                                          V
<sum_2>                       : ['#', '#', '#', '0', '+', '#', '#', '#', '0', '=', '0', '1']
                                                                               V
<sum_2>                       : ['#', '#', '#', '0', '+', '#', '#', '#', '0', '=', '0', '1']
                                                                                    V
<write_2>                     : ['#', '#', '#', '0', '+', '#', '#', '#', '0', '=', '0', '1']
                                                                                         V
<write_2>                     : ['#', '#', '#', '0', '+', '#', '#', '#', '0', '=', '0', '1']
                                                                                              V
<write_2>                     : ['#', '#', '#', '0', '+', '#', '#', '#', '0', '=', '0', '1', ' ']
                                                                                         V
<move_left_carry_1>           : ['#', '#', '#', '0', '+', '#', '#', '#', '0', '=', '0', '1', '0']
                                                                                    V
<move_left_carry_1>           : ['#', '#', '#', '0', '+', '#', '#', '#', '0', '=', '0', '1', '0']
                                                                               V
<move_left_carry_1>           : ['#', '#', '#', '0', '+', '#', '#', '#', '0', '=', '0', '1', '0']
                                                                          V
<move_left_carry_1>           : ['#', '#', '#', '0', '+', '#', '#', '#', '0', '=', '0', '1', '0']
                                                                     V
<move_left_carry_1>           : ['#', '#', '#', '0', '+', '#', '#', '#', '0', '=', '0', '1', '0']
                                                                V
<move_left_carry_1>           : ['#', '#', '#', '0', '+', '#', '#', '#', '0', '=', '0', '1', '0']
                                                           V
<move_left_carry_1>           : ['#', '#', '#', '0', '+', '#', '#', '#', '0', '=', '0', '1', '0']
                                                      V
<move_left_carry_1>           : ['#', '#', '#', '0', '+', '#', '#', '#', '0', '=', '0', '1', '0']
                                                 V
<move_left_carry_1_part_2>    : ['#', '#', '#', '0', '+', '#', '#', '#', '0', '=', '0', '1', '0']
                                            V
<move_left_carry_1_part_2>    : ['#', '#', '#', '0', '+', '#', '#', '#', '0', '=', '0', '1', '0']
                                                 V
<mark_start_carry_1>          : ['#', '#', '#', '0', '+', '#', '#', '#', '0', '=', '0', '1', '0']
                                                      V
<sum_1>                       : ['#', '#', '#', '#', '+', '#', '#', '#', '0', '=', '0', '1', '0']
                                                           V
<sum_1_get_next>              : ['#', '#', '#', '#', '+', '#', '#', '#', '0', '=', '0', '1', '0']
                                                                V
<sum_1_get_next>              : ['#', '#', '#', '#', '+', '#', '#', '#', '0', '=', '0', '1', '0']
                                                                     V
<sum_1_get_next>              : ['#', '#', '#', '#', '+', '#', '#', '#', '0', '=', '0', '1', '0']
                                                                          V
<sum_1_get_next>              : ['#', '#', '#', '#', '+', '#', '#', '#', '0', '=', '0', '1', '0']
                                                                               V
<sum_1>                       : ['#', '#', '#', '#', '+', '#', '#', '#', '#', '=', '0', '1', '0']
                                                                                    V
<write_1>                     : ['#', '#', '#', '#', '+', '#', '#', '#', '#', '=', '0', '1', '0']
                                                                                         V
<write_1>                     : ['#', '#', '#', '#', '+', '#', '#', '#', '#', '=', '0', '1', '0']
                                                                                              V
<write_1>                     : ['#', '#', '#', '#', '+', '#', '#', '#', '#', '=', '0', '1', '0']
                                                                                                   V
<write_1>                     : ['#', '#', '#', '#', '+', '#', '#', '#', '#', '=', '0', '1', '0', ' ']
                                                                                              V
<move_left_carry_0>           : ['#', '#', '#', '#', '+', '#', '#', '#', '#', '=', '0', '1', '0', '1']
                                                                                         V
<move_left_carry_0>           : ['#', '#', '#', '#', '+', '#', '#', '#', '#', '=', '0', '1', '0', '1']
                                                                                    V
<move_left_carry_0>           : ['#', '#', '#', '#', '+', '#', '#', '#', '#', '=', '0', '1', '0', '1']
                                                                               V
<move_left_carry_0>           : ['#', '#', '#', '#', '+', '#', '#', '#', '#', '=', '0', '1', '0', '1']
                                                                          V
<move_left_carry_0>           : ['#', '#', '#', '#', '+', '#', '#', '#', '#', '=', '0', '1', '0', '1']
                                                                     V
<move_left_carry_0>           : ['#', '#', '#', '#', '+', '#', '#', '#', '#', '=', '0', '1', '0', '1']
                                                                V
<move_left_carry_0>           : ['#', '#', '#', '#', '+', '#', '#', '#', '#', '=', '0', '1', '0', '1']
                                                           V
<move_left_carry_0>           : ['#', '#', '#', '#', '+', '#', '#', '#', '#', '=', '0', '1', '0', '1']
                                                      V
<move_left_carry_0>           : ['#', '#', '#', '#', '+', '#', '#', '#', '#', '=', '0', '1', '0', '1']
                                                 V
<move_left_carry_0_part_2>    : ['#', '#', '#', '#', '+', '#', '#', '#', '#', '=', '0', '1', '0', '1']
                                                      V
<mark_start_carry_0>          : ['#', '#', '#', '#', '+', '#', '#', '#', '#', '=', '0', '1', '0', '1']
####+####=0101
'accept'
```

I think this machine can be simplified by writing the carry directly to the tape (i.e. writing a '0', a '1' or a '2' to the result part of the tape, and later converting the '2's to '1's and '0's as appropriate).

***Can you build an equivalent machine with a shorter description?***
