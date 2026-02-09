import React, { useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { Button, Input, Select, RTE } from '../index'
import appwriteService from "../../appwrite/config"
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

function PostForm({ post }) {
  const { register, handleSubmit, watch, setValue, control, getValues } = useForm({
    defaultValues: {
      title: post?.title || '',
      slug: post?.slug || '',
      content: post?.content || '',
      status: post?.status || 'active',

    }
  })

  const navigate = useNavigate()
  const userData = useSelector(state => state.auth.userData)

  const submit = async (data) => {
    try {
      const selectedFile = data.image?.[0] || null;

      const uploadedFile = selectedFile
        ? await appwriteService.uploadFile(selectedFile)
        : null;

      if (post) {
        if (uploadedFile) {
          await appwriteService.deleteFile(post.featuredImage);
        }

        const dbPost = await appwriteService.updatePost(post.$id, {
          title: data.title,
          content: data.content,
          status: data.status,
          featuredImage: uploadedFile
            ? uploadedFile.$id
            : post.featuredImage,
        });

        if (dbPost) navigate(`/post/${dbPost.$id}`);

      } else {
        if (!uploadedFile) {
          throw new Error("Image required");
        }

        const dbPost = await appwriteService.createPost({
          title: data.title,
          slug: data.slug,
          content: data.content,
          status: data.status,
          featuredImage: uploadedFile.$id,
          userId: userData.$id,
        });

        if (dbPost) navigate(`/post/${dbPost.$id}`);
      }

    } catch (error) {
      console.log("Submit error:", error);
    }
  };


  // const submit = async (data) => {

  //   if (post) {
  //     const file = data.image[0] ? await appwriteService.uploadFile(data.image[0]) : null

  //     if (file) appwriteService.deleteFile(post.featuredImage);


  //     const dbPost = await appwriteService.updatePost(post.$id, {
  //       ...data,
  //       featuredImage: file ? file.$id : undefined,

  //       if(dbPost) {
  //         navigate(`/post/${dbPost.$id}`)
  //       }
  //     }


  //     )
  //   } else {
  //     const file = data.image[0] ? appwriteService.uploadFile(data.image[0]) : null

  //     if (file) {
  //       const fileId = file.$id
  //       data.featuredImage = fileId
  //       await appwriteService.createPost({
  //         ...data,
  //         userId: userData.$id,

  //       })

  //       if (dbPost) {
  //         navigate(`/post/${dbPost.$id}`)
  //       }
  //     }
  //   }
  // }


  const slugTransform = useCallback((value) => {

    // THis thing can be done in 2 ways
    // if (value && typeof value === 'string') {
    //   const slug = value.toLowerCase().replace(/ /g,'-')
    //   setValue('slug', slug)
    //   return slug
    // }

    if (value && typeof value === 'string') {
      return value
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')   // replace anything not a-z 0-9 with -
        .replace(/(^-|-$)/g, '');     // remove starting/ending -
    }
  }, [])

  React.useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === 'title') {
        setValue('slug', slugTransform(value.title, { shouldValidate: true }))
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [watch, slugTransform, setValue])

  return (
    <form onSubmit={handleSubmit(submit)} className="flex flex-wrap">
      <div className="w-2/3 px-2">
        <Input
          label="Title :"
          placeholder="Title"
          className="mb-4"
          {...register("title", { required: true })}
        />
        <Input
          label="Slug :"
          placeholder="Slug"
          className="mb-4"
          {...register("slug", { required: true })}
          onInput={(e) => {
            setValue("slug", slugTransform(e.currentTarget.value), { shouldValidate: true });
          }}
        />
        <RTE label="Content :" name="content" control={control} defaultValue={getValues("content")} />
      </div>
      <div className="w-1/3 px-2">
        <Input
          label="Featured Image :"
          placeholder="File"
          type="file"
          className="mb-4"
          accept="image/png, image/jpg, image/jpeg, image/gif"
          {...register("image", { required: !post })}
        />
        {post && (
          <div className="w-full mb-4">
            <img
              src={appwriteService.getFilePreview(post.featuredImage)}
              alt={post.title}
              className="rounded-lg"
            />
          </div>
        )}
        <Select
          options={["active", "inactive"]}
          label="Status"
          className="mb-4"
          {...register("status", { required: true })}
        />
        <Button type="submit" bgColor={post ? "bg-green-500" : undefined} className="w-full">
          {post ? "Update" : "Submit"}
        </Button>
      </div>
    </form>
  )
}

export default PostForm