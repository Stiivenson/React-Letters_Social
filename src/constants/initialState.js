export default {

    error: null,
    loading: false,

    //Комменты и посты с индентификаторами
    postIds: [],
    posts: {},
    commentIds: [],
    comments: {},

    //Хранение ссылок на разбивку страницы (через HTTP-заголовки)
    pagination: { 
        first: `${process.env
            .ENDPOINT}/posts?_page=1&_sort=date&_order=DESC&_embed=comments&_expand=user&_embed=likes`,
        next: null,
        prev: null,
        last: null
    },

    //Инфа о юзере
    user: {
        authenticated: false,
        profilePicture: null,
        id: null,
        name: null,
        token: null
    }
}