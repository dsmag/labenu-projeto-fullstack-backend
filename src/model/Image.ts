export class Image {
    constructor(
        private id: string,
        private subtitle: string,
        private authorId: string,
        private file: string,
        private tags: string[] = [],
        private collection: string,
        private date?: Date,
        private authorName?: string
    ) { }

    getId() {
        return this.id
    }

    getSubtitle() {
        return this.subtitle
    }

    getAuthorId() {
        return this.authorId
    }

    getAuthorName() {
        return this.authorName
    }

    getDate() {
        return this.date
    }

    getFile() {
        return this.file
    }

    getTags() {
        return this.tags
    }

    getCollection() {
        return this.collection
    }

    setId(id: string) {
        this.id = id
    }

    setSubtitle(subtitle: string) {
        this.subtitle = subtitle
    }

    setAuthorId(authorId: string) {
        this.authorId = authorId
    }

    setAuthorName(authorName: string) {
        this.authorName = authorName
    }

    setDate(date: Date) {
        this.date = date
    }

    setFile(file: string) {
        this.file = file
    }

    setTags(tags: string[]) {
        this.tags = tags
    }

    setCollection(collection: string) {
        this.collection = collection
    }

    static toImage(image: any): Image {
        return new Image(
            image.id,
            image.subtitle,
            image.author_id,
            image.file,
            image.tags,
            image.collection,
            image.date,
            image.author_name
        )
    }

}

export interface ImageInputDTO {
    subtitle: string
    file: string
    tags: string[]
    collection: string
}

export interface TagDTO {
    id: string,
    name: string
}

export interface ImageTagsDTO {
    imageId: string,
    tagId: string
}