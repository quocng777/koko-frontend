export type ApiResponse<T> = {
    data: T | null;
    message: string;
    status: number;
};

export type ApiPaging<T> = {
    list: T[],
    pageNum: number,
    pageSize: number,
    totalPages: number,
    total: number,
}