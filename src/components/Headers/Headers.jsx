import React from 'react'
import Footer from '../Footers/Footers'
import {Container, Logo, LogoutBtn} from '../index'
import {Link, useNavigate} from 'react-router-dom'
import { useSelector } from 'react-redux'

function Headers() {
    const authStatus = useSelector(
        (state) => state.auth.status
    ) 
    const navigate = useNavigate()

    // in production a array is used so as soon as a new button is addded we see changes in frontEnd
    const navItems = [
        {
            name: 'Home',
            slug: "/",
            // slug means where does the url go
            active: true,
        },
        {
            name: 'Login',
            slug: "/Login",
            // slug means where does the url go
            active: !authStatus,
        },
        {
            name: 'Signup',
            slug: "/signup",
            // slug means where does the url go
            active: !authStatus,
        },
        {
            name: 'All Posts',
            slug: "/all-posts",
            // slug means where does the url go
            active: authStatus,
        },
        {
            name: 'Add Post',
            slug: "/add-post",
            // slug means where does the url go
            active: authStatus,
        },
        {
            name: 'Name',
            slug: "/",
            // slug means where does the url go
            active: true
        }
    ]

  return (
    <header className='py-3 shadow bg-gray-500'>
        <Container>
            <nav className='flex'>
                <div className='mr-4'>
                    <Link to='/'>
                        <Logo width='70px'/>
                    </Link>
                </div>
                <ul
                className='flex gap-3 ml-auto items-center'>
                    {navItems.map((item) => (
                        item.active ? (
                            <li key={item.name}>
                                <button onClick={() => navigate(item.slug)}
                                className='inline-block px-6 py-2 duration-200 hover:bg-blue-100 rounded-full'
                                    >
                                        {item.name}
                                </button>
                            </li>
                        ) : null
                    ))}
                    {authStatus && (
                        <li>
                            <LogoutBtn/>
                        </li>
                    )}
                </ul>
            </nav>
        </Container>
    </header>
  )
}

export default Headers  