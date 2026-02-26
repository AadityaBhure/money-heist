export const QUESTIONS = {
  floor: {
    fp1: [
      { text: "The primary server takes 12 minutes to download the encrypted blueprints. The backup server takes 24 minutes to do the same job\nIf Rio uses both servers simultaneously, how many minutes will it take to download the blueprints? (unit not needed in answer)" },

      { text: "The door to the antechamber has a mathematical sequence lock. The sequence on the screen reads: 2, 6, 12, 20, 30, ...\nWhat is the next number required to open the door? (unit not needed in answer)" },

      { text: "A guard starts at the vault door, walks 30 meters North, turns right, and walks 40 meters to the stairwell\nWhat is the shortest straight-line distance (displacement) from the vault door to the stairwell? (unit not needed in answer)" }
    ],


    fp2: [
      { text: "The security cameras are sending reversed string logs to confuse hackers. Tokyo writes a one-line Python script: log = 'TNI_LAYOR_TLUAV' followed by print(log[::-1])\nWhat does the terminal print?" },

      { text: "Rio has a Python array containing the ID badges of everyone who entered the building, but there are hundreds of duplicate entries.\nWhich built-in Python data structure should he cast the array into to automatically and instantly remove all duplicate badge numbers?" },

      { text: "The Professor stores the master lock combination in a Python collection so Rio cannot accidentally modify, add, or delete the numbers while running his scripts\nWhich fundamental Python data type should he use because it is completely 'immutable' (unchangeable) after creation: a List, a Set, or a Tuple?" }
    ],


  fp3: [
  {
    text: `The vault door's microcontroller uses bitwise logic.
    The master key is 10 (in decimal).
    Rio runs a bitwise XOR operation against itself to force a reset:
    10 ^ 10
    What is the integer result of this XOR operation?`
  },

  {
    text: `Rio writes a C loop to continuously check if the vault door is open:
    while(1) {
    check_door();
    He forgets to include a break statement.
    In programming terminology, what will this mistake cause the program to do?`
  },

  {
    text: `The Professor intercepts this C code:
    int vaults[3] = {100, 200, 300};
    int *ptr = vaults;
    printf("%d", *(ptr + 2));
    What is printed to the terminal?`
  }

],


    fp4: [
      { text: "The floor plan of the Mint is modeled as an unweighted graph where rooms are nodes and hallways are edges\nWhich graph traversal algorithm guarantees finding the shortest path to the exit in this unweighted graph? (Only write the Acronym eg.(NASA,ISRO))" },
      { text: "Denver takes a wrong turn in the basement maze. He needs an algorithm to 'undo' his last 5 steps to get back to the junction\nWhich linear data structure perfectly models this Last-In, First-Out (LIFO) backtracking behavior?" },
      { text: "The crew passes bags of gold down a single, narrow conveyor belt to the loading dock. The very first bag of gold placed on the belt at the vault is the very first bag that arrives at the truck\nWhat fundamental data structure principle does this conveyor belt represent?" }
    ]
  },

  security: {
    sec1: [
      { text: "The security server has an array of 1 million perfectly sorted timestamp logs. The Professor needs to find the exact millisecond the alarm was tripped.\nWhat is the most efficient searching algorithm to use on a sorted array (Hint: It has the best time complexity of any Searching algorithm)" },
      { text: "The Professor is tracing a path through the Mint's server network. His algorithm explores one single network branch as deeply as possible until it hits a dead end, and only then does it backtrack to try another path\nWhich fundamental traversal algorithm is he using? (Only write the Acronym eg.(NASA,ISRO))" },
      { text: "Nairobi is erasing her digital footprints. She needs to delete her network commands in the exact reverse order she executed them (meaning the last command she entered must be the first one she deletes)\nWhat fundamental data structure principle dictates this specific order of operations? (write only abbreviation)" }
    ],
    sec2: [
      { text: "You have a Python list of thousands of IP addresses that pinged the server. You need to quickly count exactly how many times each unique IP appears.\nWhich built-in Python module (specifically imported from the collections library) is designed precisely for this task?" },
      { text: ": Rio writes a script and creates a C array designed to hold exactly 5 passwords: int passwords[5];. However, his loop accidentally tries to shove a 6th password into the array at passwords[5].\nIn programming, what is the specific term for this error, where data exceeds the boundaries of its assigned container?" },
      { text: "To crash the security monitors, Nairobi writes a script to launch thousands of parallel execution units within a single process.\nWhat are these lightweight units of execution called, which share the same memory space but run concurrently?" }
    ]
  },

  cctv: {
    cam1: [
      { text: "To manually disable the camera, Tokyo must type a 4-bit override code. The Professor tells her the code is 1111 in Binary. The physical keypad, however, only accepts Hexadecimal input\nWhat single Hexadecimal character should she press?" },
      { text: "Instead of cleverly decoding the vault's 4-digit PIN, Denver writes a script that simply tries every single possible combination, starting from 0000, 0001, 0002, all the way to 9999 until the door opens\nWhat is the official cybersecurity term for this exhaustive type of attack?" },
      { text: "The police use a standard Caesar cipher with a shift of +3 (meaning A becomes D) over their radios. You intercept the command: WDUJHW.\nDecrypt this message to find out what the police are looking at" }
    ]
  }
};
