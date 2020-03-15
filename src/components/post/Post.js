/*РАЗМЕЩЕНИЕ ПОСТОВ = ЛЕНТА*/

import React, { Component } from "react";
import PropTypes from "prop-types";

import * as API from "../../shared/http";
import Content from "./Content";
import Image from "./Image";
import Link from "./Link";
import PostActionSection from "./PostActionSection";
import Comments from "../comment/Comments";
import UserHeader from "../post/UserHeader";
import Loader from "../Loader";
import DisplayMap from "../map/DisplayMap";
import RouterLink from '../router/Link';

export class Post extends Component {
    static propTypes = {
        post: PropTypes.shape({
            comments: PropTypes.array,
            content: PropTypes.string,
            date: PropTypes.number,
            id: PropTypes.string.isRequired,
            image: PropTypes.string,
            likes: PropTypes.array,
            location: PropTypes.object,
            user: PropTypes.object,
            userId: PropTypes.string
        })
    };
    constructor(props){
        super(props);
        this.state = {
            post: null,
            comments: [],
            showComments: false,
            user: this.props.user
        };
        this.loadPost = this.loadPost.bind(this);
    }

    //Получение одного сообщения и обновление состояния
    loadPost(id){
        API.fetchPost(id)
            .then(res => res.json())
            .then(post => {
                this.setState(() => ({post}));
            });
    }

    //Загрузка сообщения при монтировании
    componentDidMount(){
        this.loadPost(this.props.id);
    }

    render() {
        return this.state.post ? (
            <div className="post">
                <RouterLink to={`/posts/${this.state.post.id}`}>
                    <span>
                        <UserHeader date={this.state.post.date} user={this.state.post.user} />
                        <Content post={this.state.post} />
                        <Image post={this.state.post} />
                        <Link link={this.state.post.link} />
                    </span>
                </RouterLink>
                {this.state.post.location && <DisplayMap location={this.state.post.location} />}
                <PostActionSection showComments={this.state.showComments} />
                <Comments
                    comments={this.state.comments}
                    show={this.state.showComments}
                    post={this.state.post}
                    handleSubmit={this.createComment}
                    user={this.props.user}
                />
            </div>
        ) : null;
    }
}

export default Post;