using Account.API.Dtos;
using Account.Domain.Models;
using AutoMapper;
using Core.Account.Models;

namespace Account.API.Mappings
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<PostUserDto, User>()
                .ConstructUsing(src => new User(src.Email, src.PhoneNumber, src.DisplayName, src.Avatar,
                    src.ProfileUrl, src.Description, src.Title, src.Address, src.BirthDate));
            CreateMap<PostOwnerUserDto, User>()
                .ConstructUsing(src => new User(src.Email, src.PhoneNumber, src.DisplayName, src.Avatar,
                    src.ProfileUrl, src.Description, src.Title, src.Address, src.BirthDate));
            CreateMap<User, UserResultDto>()
                .ForMember(i => i.Application, opt => opt.MapFrom(o => o.Application != null ?
                            new WebAppResultDto(o.Application.Id, o.Application.Name, o.Application.Code, o.Application.Description)
                            : null));
            CreateMap<Role, RoleResultDto>();
        }
    }
}
