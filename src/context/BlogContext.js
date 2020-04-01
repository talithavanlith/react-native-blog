import createDataContext from './createDataContext';
import jsonServer from '../api/jsonServer'

// define reducer
const blogReducer = (state, action) => {
    switch (action.type){
        case 'get_blogposts':
            return action.payload;

        // case 'add_blogpost':
        //     return [
        //         ...state, 
        //         {
        //             id: Math.floor(Math.random() * 99999), 
        //             title: action.payload.title, 
        //             content: action.payload.content
        //         } 
        //     ];

        case 'delete_blogpost':
            return state.filter((blogPost) => blogPost.id  !== action.payload);

        case 'edit_blogpost':
            return state.map((blogPost) => {
                return blogPost.id === action.payload.id ? action.payload : blogPost;
            });

        default: 
            return state;
    }
};

//define functions needed

const getBlogPosts = dispatch => {
    return async () => {

        try{
                const response = await jsonServer.get('/blogposts');
        
                dispatch({ type: 'get_blogposts', payload: response.data});
            
        }catch(e){
            console.log(e);
        }

    };

};

const addBlogPost = (dispatch) => {
    // ******* if we were connecting to an api/database ******
    // return async (title, content, callback) => {
    //     try{
    //         await axios.post('hsahdi', title, content)
    //         dispatch({type: 'add_blogpost', payload: { title, content}});
    //         callback();
    //     } catch (e){
    //     }
    // }
    // ****************************************************

    return  async (title, content, callback) => {
        await jsonServer.post('/blogposts', {title, content});
        // dispatch({type: 'add_blogpost', payload: { title, content}});
        if(callback){
            callback();
        }
    }
};

const deleteBlogPost = (dispatch) => {
    return async (id) => {
        await jsonServer.delete(`/blogposts/${id}`);
        dispatch({type: 'delete_blogpost', payload: id});

    }
};

const editBlogPost = (dispatch) => {
    return async (id, title, content, callback) => {
        await jsonServer.put(`/blogposts/${id}`, {title, content});
        
        dispatch({type: 'edit_blogpost', payload: {id, title, content}});
        if(callback){
            callback();
        }
    }
};

// export context and porvider stuff
export const {Context, Provider} = createDataContext(
    blogReducer,
    { addBlogPost, deleteBlogPost, editBlogPost, getBlogPosts },
    []
);




/// if i was not exporting context stuff
// export const BlogProvider = ({children}) => {
//     const [blogPosts, dispatch] = useReducer(blogReducer, []);

//     // *********** if i was using useState() ********
//     // const addBlogPost = () => {
//     //     setBlogPosts([...blogPosts, {title: `Blog Post #${blogPosts.length + 1}`} ]);
//     // }
//     // **********************************************

//     // const blogPosts = [
//     //     { title: 'Blog Post #1'},
//     //     { title: 'Blog Post #2'},
//     //     { title: 'Blog Post #3'},
        
//     // ]

//     return <BlogContext.Provider value={{data: blogPosts, addBlogPost}}>
//         {children}
//     </BlogContext.Provider>
// };
