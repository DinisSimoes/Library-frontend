export interface Book {
  id: string;
  title: string;
  authorId: string;
  authorName: string;
  genreId: string;
  genreName: string;
}

export interface BookRequest {
  id: string;
  title: string;
  authorId: string;
  genreId: string;
}
