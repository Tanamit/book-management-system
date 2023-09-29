const readline = require('readline');
const fs = require('fs');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let books = []; 

// Add Book Function
function addBook() {
  rl.question('Enter the Title: ', (title) => {
    rl.question('Enter the Author: ', (author) => {
      rl.question('Enter the Year: ', (year) => {
        rl.question('Enter the Price: ', (price) => {
          const book = {
            title,
            author,
            year,
            price
          };

          // Push the book object to the books array
          books.push(book);

          console.log(`Added book: ${title} by ${author}, Year: ${year}, Price: ${price} ฿`);

          // Save the updated books array to a JSON file
          saveBooksToJSON(books);

          rl.close();
        });
      });
    });
  });
}

// View book function
function viewBook(bookName) {
  const book = books.find((book) => book.title === bookName);

  if (book) {
    console.log(`Book Details - Title: ${book.title}, Author: ${book.author}, Year: ${book.year}, Price: ${book.price} ฿`);
  } else {
    console.log(`Book not found with the title: ${bookName}`);
  }
}

function editBook() {
  rl.question('Enter the title of the book you want to edit: ', (bookName) => {
    const book = books.find((book) => book.title === bookName);

    if (book) {
      console.log(`Editing book: ${book.title} by ${book.author}`);
      editTitle(book);
    } else {
      console.log(`Book not found with the title: ${bookName}`);
      rl.close();
    }
  });
}

// Edit book function
function editTitle(book) {
  rl.question('Enter the new Title (press Enter to keep it unchanged): ', (newTitle) => {
    book.title = newTitle || book.title; // Keep the existing title if nothing is entered
    editAuthor(book);
  });
}

function editAuthor(book) {
  rl.question('Enter the new Author (press Enter to keep it unchanged): ', (newAuthor) => {
    book.author = newAuthor || book.author; // Keep the existing author if nothing is entered
    editYear(book);
  });
}

function editYear(book) {
  rl.question('Enter the new Year (press Enter to keep it unchanged): ', (newYear) => {
    book.year = newYear || book.year; // Keep the existing year if nothing is entered
    editPrice(book);
  });
}

function editPrice(book) {
  rl.question('Enter the new Price (press Enter to keep it unchanged): ', (newPrice) => {
    book.price = newPrice || book.price; // Keep the existing price if nothing is entered

    console.log(`Book edited: ${book.title} by ${book.author}, Year: ${book.year}, Price: ${book.price} ฿`);
    saveBooksToJSON(books);
    rl.close();
  });
}

// Delete book function
function deleteBook() {
  rl.question('Enter the title of the book you want to delete: ', (bookName) => {
    const bookIndex = books.findIndex((book) => book.title === bookName);

    if (bookIndex !== -1) {
      const book = books[bookIndex];
      console.log(`Deleting book: ${book.title} by ${book.author}`);

      rl.question('Are you sure you want to delete this book? (yes/no): ', (confirmation) => {
        if (confirmation.toLowerCase() === 'yes') {
          // Remove the book from the books array
          books.splice(bookIndex, 1);
          console.log(`Book "${book.title}" deleted.`);
          saveBooksToJSON(books);
        } else {
          console.log('Book deletion canceled.');
        }
        rl.close();
      });
    } else {
      console.log(`Book not found with the title: ${bookName}`);
      rl.close();
    }
  });
}

// Save book detail
function saveBooksToJSON(booksData) {
  const jsonData = JSON.stringify(booksData, null, 2);

  fs.writeFile('books.json', jsonData, (err) => {
    if (err) {
      console.error('Error saving data to file:', err);
    } else {
      console.log('Data saved to books.json');
    }
  });
}

// Load book function
function loadBooksFromJSON() {
  try {
    const data = fs.readFileSync('books.json', 'utf8');
    books = JSON.parse(data);
  } catch (err) {
    // Handle file not found or JSON parsing errors
    console.error('Error loading data from file:', err);
  }
}

// Load books data from JSON file on startup
loadBooksFromJSON();

function main() {
  rl.question('Enter one of the following options:\n' +
  '- "add" to add a book\n' +
  '- "view" to view a book\n' +
  '- "edit" to edit a book\n' +
  '- "delete" to delete a book\n' +
  '- "exit" to quit\n' +
  'Your choice: ', (choice) => {
    if (choice === 'add' || choice === 'Add') {
      addBook();
    } else if (choice === 'view' || choice === 'View') {
      rl.question('Enter the title of the book you want to view: ', (bookName) => {
        viewBook(bookName);
        rl.close();
      });
    } else if (choice === 'edit' || choice === 'Edit') {
        editBook();  
      } else if (choice === 'delete' || choice === 'Delete') {
        deleteBook();  
      } else if (choice === 'exit') {
        rl.close();
      } else {
      console.log('Invalid choice');
      rl.close();
    }
  });
}

main();
