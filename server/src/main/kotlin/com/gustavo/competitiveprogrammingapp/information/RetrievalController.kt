package com.gustavo.competitiveprogrammingapp.information

import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.data.domain.Pageable
import org.springframework.data.domain.Slice
import org.springframework.data.domain.SliceImpl
import org.springframework.hateoas.Link
import org.springframework.hateoas.PagedModel
import org.springframework.hateoas.server.mvc.WebMvcLinkBuilder
import org.springframework.hateoas.server.mvc.linkTo
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import kotlin.math.min

@RestController
@RequestMapping("info/")
class RetrievalController(
) {
    private val logger: Logger = LoggerFactory.getLogger(javaClass)

    private fun <T> attachPageDataAndLinks(
        content: List<T>,
        pageable: Pageable,
        totalElements: Long,
        link: Link
    ): ResponseEntity<*> {
        val pageSize = pageable.pageSize.toLong()
        val pageNumber = pageable.pageNumber.toLong()
        val pageMetadata = PagedModel.PageMetadata(pageSize, pageNumber, totalElements)

        val pagedModel = PagedModel.of(content, pageMetadata)
        pagedModel.add(link)

        return ResponseEntity.ok(pagedModel)
    }

    private fun <T> attachPageDataAndLinksToSlice(
        content: Slice<T>,
        pageable: Pageable,
        totalElements: Long,
        link: Link
    ): ResponseEntity<*> {
        return attachPageDataAndLinks(content.toList(), pageable, totalElements, link)
    }

    private fun <T> toSlice(list: List<T>, pageable: Pageable): Slice<T> {
        if (pageable.offset >= list.size) {
            return SliceImpl(emptyList(), pageable, false)
        }
        val startIndex = pageable.offset.toInt()
        val endIndex = min((pageable.offset + pageable.pageSize).toInt(), list.size)
        val subList = list.subList(startIndex, endIndex)

        return SliceImpl(subList, pageable, endIndex != list.size)
    }

    /*@GetMapping("userProblemStatuses")
    @ResponseBody
    fun linkingExample(pageable: Pageable, @RequestParam handle: String): ResponseEntity<*> {
        val content = userProblemStatusRepository.findByUser(handle)
        val link = linkTo<RetrievalController> {
            WebMvcLinkBuilder.methodOn(RetrievalController::class.java)
                .getThat(pageable, handle)
        }.withSelfRel()
        return attachPageDataAndLinks(content, pageable, 0, link)
    }*/
}